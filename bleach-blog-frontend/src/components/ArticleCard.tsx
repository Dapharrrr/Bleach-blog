import Link from 'next/link';
import Image from 'next/image';
import { Article } from '../types/article';
import styles from './ArticleCard.module.css';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getImageUrl = (coverImage: Article['coverImage']) => {
    // Utiliser l'image medium si disponible, sinon small, sinon l'originale
    if (coverImage.formats.medium) {
      return `http://localhost:1337${coverImage.formats.medium.url}`;
    } else if (coverImage.formats.small) {
      return `http://localhost:1337${coverImage.formats.small.url}`;
    }
    return `http://localhost:1337${coverImage.url}`;
  };

  return (
    <Link href={`/articles/${article.slug}`} className={styles.card}>
      <div className={styles.imageContainer}>
        {article.coverImage && (
          <Image
            src={getImageUrl(article.coverImage)}
            alt={article.coverImage.alternativeText || article.title}
            fill
            className={styles.image}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{article.title}</h3>
        <div className={styles.meta}>
          <p className={styles.author}>Par {article.authorName}</p>
          <p className={styles.date}>{formatDate(article.publishedAt)}</p>
        </div>
      </div>
    </Link>
  );
}
