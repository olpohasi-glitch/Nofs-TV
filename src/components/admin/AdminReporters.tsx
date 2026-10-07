import React, { useState } from 'react';
import { Users, Plus, Edit, Trash2, Mail, Phone, Check, X } from 'lucide-react';
import { useNews } from '../../context/NewsContext';
import { Reporter } from '../../types';
import { toBengaliNumber } from '../../utils/bengali';

export const AdminReporters: React.FC = () => {
  const { reporters, news, addReporter, updateReporter, deleteReporter } = useNews();

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
  );
  const [editingRep, setEditingRep] = useState<Reporter | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addReporter({
      name: name.trim(),
      role: role.trim() || 'প্রতিবেদক',
      email: email.trim(),
      phone: phone.trim(),
      bio: bio.trim(),
      avatar: avatar.trim()
    });

    setName('');
    setRole('');
    setEmail('');
    setPhone('');
    setBio('');
  };

  const handleUpdate = () => {
    if (editingRep && editingRep.name.trim()) {
      updateReporter(editingRep.id, editingRep);
      setEditingRep(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-red-600" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              প্রতিবেদক ও নিউজরুম টিম (Reporters Management)
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            সাংবাদিকদের তালিকা, পদবী ও তাদের প্রকাশিত প্রতিবেদনের হিসাব
          </p>
        </div>
      </div>

      {/* Add Reporter Form */}
      <form
        onSubmit={handleAdd}
        className="bg-gray-50 border border-gray-200 p-4 rounded-xl"
      >
        <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Plus className="w-4 h-4 text-red-700" />
          <span>নতুন প্রতিবেদক যুক্ত করুন</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              প্রতিবেদকের নাম *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="যেমন: আহমদ শফিক"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-xs focus:outline-none focus:border-red-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              পদবী (Designation) *
            </label>
            <input
              type="text"
              required
              value={role}
              onChange={e => setRole(e.target.value)}
              placeholder="যেমন: স্টাফ রিপোর্টার, সিলেট ব্যুরো"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-xs focus:outline-none focus:border-red-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              প্রোফাইল ছবি (Avatar URL)
            </label>
            <input
              type="text"
              value={avatar}
              onChange={e => setAvatar(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-xs focus:outline-none focus:border-red-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              ইমেইল
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="reporter@nofstv.com"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-xs focus:outline-none focus:border-red-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              ফোন নম্বর
            </label>
            <input
              type="text"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+880 1700-000000"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-xs focus:outline-none focus:border-red-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              সংক্ষিপ্ত বায়োগ্রাফি (Bio)
            </label>
            <input
              type="text"
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="সাংবাদিকতার অভিজ্ঞতা..."
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-xs focus:outline-none focus:border-red-600"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>প্রতিবেদক যুক্ত করুন</span>
        </button>
      </form>

      {/* Reporters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reporters.map(rep => {
          const articleCount = news.filter(n => n.reporterName === rep.name).length;
          const isEditing = editingRep?.id === rep.id;

          return (
            <div
              key={rep.id}
              className="p-4 bg-white rounded-xl border border-gray-200 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-3">
                  <img
                    src={rep.avatar}
                    alt={rep.name}
                    className="w-12 h-12 rounded-full object-cover border border-red-200"
                  />
                  <div className="flex-1 min-w-0">
                    {isEditing ? (
                      <div className="space-y-1 mb-2">
                        <input
                          type="text"
                          value={editingRep.name}
                          onChange={e =>
                            setEditingRep({ ...editingRep, name: e.target.value })
                          }
                          className="w-full px-2 py-0.5 border border-red-500 rounded text-xs font-bold"
                        />
                        <input
                          type="text"
                          value={editingRep.role}
                          onChange={e =>
                            setEditingRep({ ...editingRep, role: e.target.value })
                          }
                          className="w-full px-2 py-0.5 border border-red-500 rounded text-[11px]"
                        />
                      </div>
                    ) : (
                      <>
                        <h4 className="font-bold text-sm text-gray-900 truncate">
                          {rep.name}
                        </h4>
                        <span className="text-xs font-semibold text-red-700 block">
                          {rep.role}
                        </span>
                      </>
                    )}
                    <span className="text-[11px] text-gray-500 block mt-0.5">
                      মোট সংবাদ: <strong className="text-gray-800">{toBengaliNumber(articleCount)}</strong> টি
                    </span>
                  </div>
                </div>

                <p className="text-xs text-gray-600 mt-3 line-clamp-2 leading-relaxed">
                  {rep.bio || 'NOFS TV নিউজরুম টিম সদস্য।'}
                </p>

                <div className="mt-3 pt-2 border-t border-gray-100 text-[11px] text-gray-500 space-y-1">
                  {rep.email && (
                    <div className="flex items-center gap-1.5 truncate">
                      <Mail className="w-3 h-3 text-gray-400" />
                      <span>{rep.email}</span>
                    </div>
                  )}
                  {rep.phone && (
                    <div className="flex items-center gap-1.5 truncate">
                      <Phone className="w-3 h-3 text-gray-400" />
                      <span>{rep.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-4 pt-2 border-t border-gray-100 flex items-center justify-end space-x-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleUpdate}
                      className="px-2.5 py-1 bg-emerald-600 text-white text-xs font-bold rounded flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>সংরক্ষণ</span>
                    </button>
                    <button
                      onClick={() => setEditingRep(null)}
                      className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded"
                    >
                      বাতিল
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setEditingRep(rep)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded cursor-pointer"
                      title="সম্পাদনা"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    {rep.name !== 'M. Ajmol Hussain Jakir' && (
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              `আপনি কি "${rep.name}"-কে অপসারণ করতে চান?`
                            )
                          ) {
                            deleteReporter(rep.id);
                          }
                        }}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                        title="অপসারণ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
