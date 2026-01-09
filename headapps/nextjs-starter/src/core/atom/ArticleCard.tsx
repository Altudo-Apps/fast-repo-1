import React from 'react';
import type { ActionProp, ItemClickedAction } from '@sitecore-search/react';
import { ArticleCard as ArticleCardUI } from '@sitecore-search/ui';
import { CustomButtonLink } from './CustomButtonLink';
import type { LinkField } from '@sitecore-content-sdk/nextjs';

type ArticleCardProps = {
  className?: string;
  article: {
    id: string;
    name?: string;
    title?: string;
    url?: string;
    source_id?: string;
    image_url?: string;
    author?: string;
    description?: string;
    subtitle?: string;
  };
  onItemClick: ActionProp<ItemClickedAction>;
  index: number;
};

const DEFAULT_IMG_URL = 'https://placehold.co/500x300?text=No%20Image';

const ArticleCard: React.FC<ArticleCardProps> = ({
  className = '',
  article,
  onItemClick,
  index,
}) => {
  const linkField: LinkField = {
    value: {
      href: article.url || '#',
      text: 'Read More',
      title: article.name || article.title,
    },
  };

  return (
    <ArticleCardUI.Root
      key={article.id}
      className={`group flex flex-col overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm dark:border-gray-600 dark:bg-gray-800 ${className}`}
    >
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <ArticleCardUI.Image
          src={article?.image_url || DEFAULT_IMG_URL}
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <ArticleCardUI.Title className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
          {article.name || article.title}
        </ArticleCardUI.Title>
        {article.subtitle && (
          <ArticleCardUI.Subtitle className="mb-2 text-sm text-gray-600 dark:text-gray-400">
            {article.subtitle}
          </ArticleCardUI.Subtitle>
        )}
        {article.author && (
          <ArticleCardUI.Subtitle className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            {article.author}
          </ArticleCardUI.Subtitle>
        )}
        {article.description && (
          <div className="mt-auto mb-3 text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
            {article.description}
          </div>
        )}
        <CustomButtonLink
          variant="outline"
          field={linkField}
          className="w-full px-3 bg-transparent"
          onClick={(event) => {
            event.preventDefault();
            onItemClick({
              id: article.id,
              index,
              sourceId: article.source_id,
            });
          }}
        >
          Read More
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </CustomButtonLink>
      </div>
    </ArticleCardUI.Root>
  );
};

export default ArticleCard;
