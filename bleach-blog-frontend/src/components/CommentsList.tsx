import { Comment } from '../types/article';
import styles from './CommentsList.module.css';

interface CommentsListProps {
  comments: Comment[];
}

export default function CommentsList({ comments }: CommentsListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (comments.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>Aucun commentaire pour le moment. Soyez le premier à commenter !</p>
      </div>
    );
  }

  return (
    <div className={styles.commentsList}>
      {comments.map((comment) => (
        <div key={comment.id} className={styles.comment}>
          <div className={styles.commentHeader}>
            <span className={styles.authorName}>
              {comment.authorName}
            </span>
            <span className={styles.date}>
              {formatDate(comment.publishedAt || comment.createdAt)}
            </span>
          </div>
          <div className={styles.commentContent}>
            {comment.content}
          </div>
        </div>
      ))}
    </div>
  );
}