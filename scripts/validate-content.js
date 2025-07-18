#!/usr/bin/env node

/**
 * Content Validation Script
 * 
 * This script validates the content structure to ensure:
 * - All courses have valid meta.json files
 * - All lessons referenced in metadata exist as .mdx files
 * - Order fields are sequential
 * - Required fields are present
 * 
 * Usage: node scripts/validate-content.js
 */

const fs = require('fs');
const path = require('path');

const contentDir = path.join(process.cwd(), 'content', 'courses');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

/**
 * Validate course metadata
 */
function validateCourseMeta(courseSlug, metaPath) {
  try {
    const metaContent = fs.readFileSync(metaPath, 'utf8');
    const meta = JSON.parse(metaContent);
    
    const errors = [];
    const warnings = [];
    
    // Required fields
    const requiredFields = ['id', 'title', 'description', 'slug', 'order', 'isPublished', 'estimatedHours', 'modules'];
    requiredFields.forEach(field => {
      if (!meta[field]) {
        errors.push(`Missing required field: ${field}`);
      }
    });
    
    // Validate slug matches directory
    if (meta.slug !== courseSlug) {
      errors.push(`Slug mismatch: metadata has "${meta.slug}" but directory is "${courseSlug}"`);
    }
    
    // Validate modules
    if (!Array.isArray(meta.modules)) {
      errors.push('Modules must be an array');
    } else {
      meta.modules.forEach((module, index) => {
        const moduleErrors = validateModuleMeta(courseSlug, module, index);
        errors.push(...moduleErrors);
      });
    }
    
    // Check for sequential order
    if (meta.modules && meta.modules.length > 0) {
      const orders = meta.modules.map(m => m.order).sort((a, b) => a - b);
      for (let i = 0; i < orders.length; i++) {
        if (orders[i] !== i + 1) {
          warnings.push(`Module orders are not sequential: ${orders.join(', ')}`);
          break;
        }
      }
    }
    
    return { errors, warnings, meta };
  } catch (error) {
    return { 
      errors: [`Failed to parse meta.json: ${error.message}`], 
      warnings: [],
      meta: null 
    };
  }
}

/**
 * Validate module metadata
 */
function validateModuleMeta(courseSlug, module, moduleIndex) {
  const errors = [];
  
  // Required fields
  const requiredFields = ['id', 'title', 'description', 'slug', 'order', 'estimatedHours', 'lessons'];
  requiredFields.forEach(field => {
    if (!module[field]) {
      errors.push(`Module ${moduleIndex + 1}: Missing required field: ${field}`);
    }
  });
  
  // Validate lessons
  if (!Array.isArray(module.lessons)) {
    errors.push(`Module ${moduleIndex + 1}: Lessons must be an array`);
  } else {
    module.lessons.forEach((lesson, lessonIndex) => {
      const lessonErrors = validateLessonMeta(courseSlug, module.slug, lesson, lessonIndex);
      errors.push(...lessonErrors);
    });
  }
  
  return errors;
}

/**
 * Validate lesson metadata
 */
function validateLessonMeta(courseSlug, moduleSlug, lesson, lessonIndex) {
  const errors = [];
  
  // Required fields
  const requiredFields = ['id', 'title', 'description', 'slug', 'order', 'type', 'isPublished'];
  requiredFields.forEach(field => {
    if (!lesson[field]) {
      errors.push(`Lesson ${lessonIndex + 1}: Missing required field: ${field}`);
    }
  });
  
  // Validate type
  const validTypes = ['lesson', 'project', 'assignment'];
  if (lesson.type && !validTypes.includes(lesson.type)) {
    errors.push(`Lesson ${lessonIndex + 1}: Invalid type "${lesson.type}". Must be one of: ${validTypes.join(', ')}`);
  }
  
  // Check if lesson file exists
  const lessonPath = path.join(contentDir, courseSlug, 'modules', moduleSlug, 'lessons', `${lesson.slug}.mdx`);
  if (!fs.existsSync(lessonPath)) {
    errors.push(`Lesson ${lessonIndex + 1}: File not found: ${lessonPath}`);
  }
  
  return errors;
}

/**
 * Validate lesson file content
 */
function validateLessonFile(courseSlug, moduleSlug, lessonSlug) {
  const lessonPath = path.join(contentDir, courseSlug, 'modules', moduleSlug, 'lessons', `${lessonSlug}.mdx`);
  
  if (!fs.existsSync(lessonPath)) {
    return [`Lesson file not found: ${lessonPath}`];
  }
  
  const errors = [];
  const content = fs.readFileSync(lessonPath, 'utf8');
  
  // Check for frontmatter
  if (!content.startsWith('---')) {
    errors.push(`Lesson ${lessonSlug}: Missing frontmatter (must start with ---)`);
    return errors;
  }
  
  // Check for closing frontmatter
  const frontmatterEnd = content.indexOf('\n---', 3);
  if (frontmatterEnd === -1) {
    errors.push(`Lesson ${lessonSlug}: Invalid frontmatter (must end with ---)`);
    return errors;
  }
  
  // Extract and validate frontmatter
  const frontmatter = content.substring(3, frontmatterEnd);
  try {
    const yaml = require('js-yaml');
    const parsed = yaml.load(frontmatter);
    
    // Check required fields
    const requiredFields = ['title', 'description', 'type', 'order'];
    requiredFields.forEach(field => {
      if (!parsed[field]) {
        errors.push(`Lesson ${lessonSlug}: Missing required frontmatter field: ${field}`);
      }
    });
    
    // Validate type
    const validTypes = ['lesson', 'project', 'assignment'];
    if (parsed.type && !validTypes.includes(parsed.type)) {
      errors.push(`Lesson ${lessonSlug}: Invalid type "${parsed.type}". Must be one of: ${validTypes.join(', ')}`);
    }
    
  } catch (error) {
    errors.push(`Lesson ${lessonSlug}: Invalid YAML in frontmatter: ${error.message}`);
  }
  
  return errors;
}

/**
 * Main validation function
 */
function validateContent() {
  log('🔍 Validating content structure...', 'cyan');
  log('');
  
  if (!fs.existsSync(contentDir)) {
    logError(`Content directory not found: ${contentDir}`);
    process.exit(1);
  }
  
  const courseSlugs = fs.readdirSync(contentDir).filter(dir => {
    return fs.statSync(path.join(contentDir, dir)).isDirectory();
  });
  
  if (courseSlugs.length === 0) {
    logWarning('No courses found in content directory');
    return;
  }
  
  let totalErrors = 0;
  let totalWarnings = 0;
  
  courseSlugs.forEach(courseSlug => {
    log(`📚 Validating course: ${courseSlug}`, 'magenta');
    
    const metaPath = path.join(contentDir, courseSlug, 'meta.json');
    
    if (!fs.existsSync(metaPath)) {
      logError(`Course ${courseSlug}: Missing meta.json file`);
      totalErrors++;
      return;
    }
    
    const { errors, warnings, meta } = validateCourseMeta(courseSlug, metaPath);
    
    if (errors.length > 0) {
      errors.forEach(error => logError(`  ${error}`));
      totalErrors += errors.length;
    }
    
    if (warnings.length > 0) {
      warnings.forEach(warning => logWarning(`  ${warning}`));
      totalWarnings += warnings.length;
    }
    
    // Validate lesson files
    if (meta && meta.modules) {
      meta.modules.forEach(module => {
        if (module.lessons) {
          module.lessons.forEach(lesson => {
            const lessonErrors = validateLessonFile(courseSlug, module.slug, lesson.slug);
            lessonErrors.forEach(error => logError(`  ${error}`));
            totalErrors += lessonErrors.length;
          });
        }
      });
    }
    
    if (errors.length === 0 && warnings.length === 0) {
      logSuccess(`  Course ${courseSlug} is valid`);
    }
    
    log('');
  });
  
  // Summary
  log('📊 Validation Summary:', 'cyan');
  if (totalErrors === 0 && totalWarnings === 0) {
    logSuccess('All content is valid! 🎉');
  } else {
    if (totalErrors > 0) {
      logError(`${totalErrors} error(s) found`);
    }
    if (totalWarnings > 0) {
      logWarning(`${totalWarnings} warning(s) found`);
    }
    logInfo('Please fix the issues above before submitting your contribution');
  }
}

// Run validation if this script is executed directly
if (require.main === module) {
  validateContent();
}

module.exports = { validateContent }; 