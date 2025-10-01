import { Article } from '../types/article';
import ArticleCard from './ArticleCard';
import styles from './ArticlesGrid.module.css';

interface ArticlesGridProps {
  articles: Article[];
  isLoading?: boolean;
}

export default function ArticlesGrid({ articles, isLoading = false }: ArticlesGridProps) {
  if (isLoading) {
    return (
      <div className={styles.loading}>
        <p>Chargement des articles...</p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className={styles.empty}>
        <p>Aucun article publié pour le moment.</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {articles.map((article) => (
        <ArticleCard key={article.documentId} article={article} />
      ))}
    </div>
  );
}
