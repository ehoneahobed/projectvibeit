# Discussion System

The discussion system allows students to ask questions and get help from the community on specific lessons. This feature promotes collaborative learning and provides a platform for peer-to-peer support.

## Features

### For Students
- **Ask Questions**: Create new discussions on any lesson
- **Reply to Discussions**: Help other students by providing answers
- **Threaded Replies**: Reply directly to specific answers for better organization
- **View Discussion History**: See all questions and answers for a lesson
- **Mark as Resolved**: Discussion authors can mark their questions as resolved

### For Admins & Contributors
- **Moderate Discussions**: View and manage all discussions across courses
- **Resolve Discussions**: Mark discussions as resolved or unresolved
- **Search & Filter**: Find specific discussions by content or status
- **Analytics**: View discussion statistics and engagement metrics

## How It Works

### Creating a Discussion
1. Navigate to any lesson page
2. Scroll down to the "Discussions" section
3. Click "Ask Question" button
4. Write your question in the text area
5. Click "Post Question" to submit

### Replying to Discussions
1. Find a discussion you want to reply to
2. Click the "Reply" button
3. Write your response in the text area
4. Click "Post Reply" to submit

### Managing Discussions (Admin/Contributor)
1. Go to `/portal/community/discussions`
2. View all discussions with search and filter options
3. Click "View" to see full discussion details
4. Use the resolve/unresolve functionality as needed

## API Endpoints

### Get Discussions
```
GET /api/discussions?lessonId=123
GET /api/discussions?courseSlug=fundamentals&moduleSlug=intro&lessonSlug=what-is-vibe-coding
```

### Create Discussion
```
POST /api/discussions
{
  "lessonId": "123",
  "content": "How do I implement this feature?"
}
```

### Add Reply
```
POST /api/discussions/{discussionId}/replies
{
  "content": "Here's how you can implement it..."
}
```

### Add Threaded Reply
```
POST /api/discussions/{discussionId}/replies/{replyId}/replies
{
  "content": "I agree with your approach, but here's an alternative..."
}
```

### Mark as Resolved
```
PATCH /api/discussions/{discussionId}/resolve
{
  "isResolved": true
}
```

## Database Schema

### Discussion Model
```typescript
interface IDiscussion {
  lessonId: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  content: string
  replies: IReply[]
  isResolved: boolean
  createdAt: Date
  updatedAt: Date
}
```

### Reply Model
```typescript
interface IReply {
  _id?: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  content: string
  createdAt: Date
  replies?: IReply[] // Nested replies for threading
  parentReplyId?: mongoose.Types.ObjectId // Reference to parent reply
}
```

## Components

### DiscussionSection
Main component for displaying discussions on lesson pages.

**Props:**
- `courseSlug`: Course identifier
- `moduleSlug`: Module identifier  
- `lessonSlug`: Lesson identifier
- `lessonId`: Optional lesson ID for direct database lookup

### DiscussionManagement
Admin/contributor component for managing all discussions.

**Features:**
- Search discussions by content
- Filter by resolved/unresolved status
- View discussion statistics
- Bulk management capabilities

## Permissions

### Student Permissions
- Create discussions on any lesson
- Reply to any discussion
- Mark own discussions as resolved
- View all discussions

### Contributor Permissions
- All student permissions
- Resolve any discussion
- Access discussion management panel
- View discussion analytics

### Admin Permissions
- All contributor permissions
- Delete discussions (future feature)
- Manage user permissions
- Access full analytics

## Best Practices

### For Students
1. **Be Specific**: Ask clear, specific questions
2. **Provide Context**: Include relevant code or error messages
3. **Search First**: Check if your question has already been answered
4. **Be Respectful**: Maintain a positive, helpful tone
5. **Mark Resolved**: Mark your question as resolved when you get an answer

### For Contributors
1. **Be Helpful**: Provide clear, actionable answers
2. **Encourage Learning**: Guide students to solutions rather than just giving answers
3. **Moderate Content**: Ensure discussions remain on-topic and respectful
4. **Resolve Appropriately**: Only mark discussions as resolved when the question is actually answered

## Future Enhancements

### Planned Features
- **Rich Text Editor**: Support for markdown and code highlighting
- **File Attachments**: Allow students to attach code files or images
- **Voting System**: Upvote/downvote helpful answers
- **Email Notifications**: Notify users of replies to their discussions
- **Discussion Categories**: Organize discussions by topic or difficulty
- **AI-Powered Suggestions**: Suggest similar discussions or resources

### Technical Improvements
- **Real-time Updates**: WebSocket integration for live discussion updates
- **Advanced Search**: Full-text search with filters
- **Discussion Analytics**: Track engagement and response times
- **Mobile Optimization**: Improve mobile experience
- **Accessibility**: Enhance screen reader support

## Troubleshooting

### Common Issues

**Discussion not appearing:**
- Check if the lesson exists in the database
- Verify user permissions
- Check browser console for errors

**Can't reply to discussions:**
- Ensure user is authenticated
- Check if discussion exists
- Verify network connectivity

**Admin panel not accessible:**
- Confirm user has admin/contributor role
- Check route permissions
- Verify authentication status

### Debug Information
- All API responses include `success` boolean and optional `error` message
- Check browser network tab for failed requests
- Review server logs for detailed error information
- Use browser developer tools to inspect component state

## Contributing

To contribute to the discussion system:

1. **Report Bugs**: Use GitHub issues with detailed reproduction steps
2. **Suggest Features**: Create feature requests with use cases
3. **Submit PRs**: Follow the project's coding standards
4. **Test Thoroughly**: Ensure changes work across different scenarios
5. **Update Documentation**: Keep this documentation current

## Support

For questions about the discussion system:
- Check this documentation first
- Search existing GitHub issues
- Create a new issue with detailed information
- Join the project's Discord community 