import React, { useState } from 'react';
import { FolderTree, Plus, Edit, Trash2, Check, X, Newspaper } from 'lucide-react';
import { useNews } from '../../context/NewsContext';
import { Category } from '../../types';
import { toBengaliNumber } from '../../utils/bengali';

export const AdminCategories: React.FC = () => {
  const { categories, news, addCategory, updateCategory, deleteCategory } = useNews();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [editingCat, setEditingCat] = useState<Category | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addCategory(
      name.trim(),
      slug.trim() || name.trim().toLowerCase().replace(/\s+/g, '-'),
      description.trim()
    );

    setName('');
    setSlug('');
    setDescription('');
  };

  const handleUpdate = () => {
    if (editingCat && editingCat.name.trim()) {
      updateCategory(
        editingCat.id,
        editingCat.name.trim(),
        editingCat.slug.trim(),
        editingCat.description.trim()
      );
      setEditingCat(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-red-600" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              ক্যাটাগরি ব্যবস্থাপনা (Category Management)
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            ওয়েবসাইটের সকল সংবাদ ক্যাটাগরি ও তাদের বিভাগীয় প্রকাশনা সংখ্যা
          </p>
        </div>
      </div>

      {/* Add New Category */}
      <form
        onSubmit={handleAdd}
        className="bg-gray-50 border border-gray-200 p-4 rounded-xl"
      >
        <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Plus className="w-4 h-4 text-red-700" />
          <span>নতুন ক্যাটাগরি যুক্ত করুন</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              ক্যাটাগরির নাম (বাংলা) *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="যেমন: পরিবেশ ও জলবায়ু"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-xs focus:outline-none focus:border-red-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              স্লাগ (Slug - English URL)
            </label>
            <input
              type="text"
              value={slug}
              onChange={e => setSlug(e.target.value)}
              placeholder="যেমন: environment"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-xs focus:outline-none focus:border-red-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              বিবরণ (Description)
            </label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="বিভাগীয় সংক্ষিপ্ত পরিচিতি..."
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-xs focus:outline-none focus:border-red-600"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>ক্যাটাগরি যুক্ত করুন</span>
        </button>
      </form>

      {/* Categories Table */}
      <div className="border border-gray-200 rounded-lg overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm text-gray-700">
          <thead className="bg-gray-50 text-xs text-gray-600 uppercase border-b border-gray-200">
            <tr>
              <th className="py-3 px-4">ক্যাটাগরি নাম</th>
              <th className="py-3 px-3">স্লাগ</th>
              <th className="py-3 px-3">বিবরণ</th>
              <th className="py-3 px-3 text-center">প্রকাশিত সংবাদ সংখ্যা</th>
              <th className="py-3 px-4 text-right">পদক্ষেপ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map(cat => {
              const isEditing = editingCat?.id === cat.id;
              const count = news.filter(n => n.category === cat.name).length;

              return (
                <tr key={cat.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-gray-900">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editingCat.name}
                        onChange={e =>
                          setEditingCat({ ...editingCat, name: e.target.value })
                        }
                        className="px-2 py-1 border border-red-500 rounded text-xs"
                      />
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-600"></span>
                        {cat.name}
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-3 font-mono text-xs text-gray-500">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editingCat.slug}
                        onChange={e =>
                          setEditingCat({ ...editingCat, slug: e.target.value })
                        }
                        className="px-2 py-1 border border-red-500 rounded text-xs"
                      />
                    ) : (
                      cat.slug
                    )}
                  </td>

                  <td className="py-3 px-3 text-xs text-gray-600 max-w-xs truncate">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editingCat.description}
                        onChange={e =>
                          setEditingCat({
                            ...editingCat,
                            description: e.target.value
                          })
                        }
                        className="px-2 py-1 border border-red-500 rounded text-xs w-full"
                      />
                    ) : (
                      cat.description || '-'
                    )}
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 font-bold text-xs">
                      <Newspaper className="w-3 h-3" />
                      <span>{toBengaliNumber(count)} টি</span>
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    {isEditing ? (
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={handleUpdate}
                          className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                          title="সংরক্ষণ"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingCat(null)}
                          className="p-1 text-gray-400 hover:bg-gray-100 rounded"
                          title="বাতিল"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => setEditingCat(cat)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded cursor-pointer"
                          title="সম্পাদনা"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                `আপনি কি "${cat.name}" ক্যাটাগরি মুছে ফেলতে চান?`
                              )
                            ) {
                              deleteCategory(cat.id);
                            }
                          }}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
