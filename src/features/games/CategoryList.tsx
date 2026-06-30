import type { Category } from '../../types';

type CategoryListProps = {
  categories: Category[];
  selectedCategoryId: number | null;
  onSelectCategory: (categoryId: number | null) => void;
};

export function CategoryList({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CategoryListProps) {
  return (
    <section className="category-list" aria-label="Game categories">
      <h2>Categories</h2>

      <div className="category-options" role="list">
        {categories.map((category) => {
          const isAllCategory = category.name.toUpperCase() === 'ALL';
          const categoryId = isAllCategory ? null : category.id;
          const isSelected = selectedCategoryId === categoryId;

          return (
            <button
              key={category.id}
              type="button"
              className={`category-option${isSelected ? ' is-active' : ''}`}
              aria-pressed={isSelected}
              onClick={() => onSelectCategory(categoryId)}
            >
              {category.name}
            </button>
          );
        })}
      </div>
    </section>
  );
}