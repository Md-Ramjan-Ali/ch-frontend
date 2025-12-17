import React, { useState } from 'react';
import { Lesson, Difficulty, Category, LessonSection, LessonSectionType, LessonAccess } from './types';
import { VocabularyIcon, GrammarIcon, ExerciseIcon, MediaIcon, TrashIcon, UploadIcon } from './icons';

// Add isLoading prop to the interface
interface CreateLessonFormProps {
  onSave: (lesson: Omit<Lesson, 'id' | 'status' | 'lastModified'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}



const CreateLessonForm: React.FC<CreateLessonFormProps> = ({ onSave, onCancel }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Beginner);
    const [category, setCategory] = useState<Category>(Category.Reading);
    const [estimatedDuration, setEstimatedDuration] = useState('15 mins');
    const [sections, setSections] = useState<LessonSection[]>([]);
    const [access, setAccess] = useState<LessonAccess>(LessonAccess.Free);

    const addSection = (type: LessonSectionType) => {
        const newSection: LessonSection = {
            id: Date.now(),
            type,
            title: '',
            content: '',
        };
        setSections([...sections, newSection]);
    };

    const removeSection = (id: number) => {
        setSections(sections.filter(section => section.id !== id));
    };

    const handleSectionChange = (id: number, field: 'title' | 'content', value: string) => {
        setSections(sections.map(section =>
            section.id === id ? { ...section, [field]: value } : section
        ));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ title, description, difficulty, category, estimatedDuration, content: sections, access, cards: 0, avgRating: 0 });
    };

    const getSectionIcon = (type: LessonSectionType) => {
        switch (type) {
            case LessonSectionType.Vocabulary: return <VocabularyIcon />;
            case LessonSectionType.Grammar: return <GrammarIcon />;
            case LessonSectionType.Exercise: return <ExerciseIcon />;
            case LessonSectionType.Media: return <MediaIcon />;
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-xl shadow-sm dark:bg-gray-800">
            <div className="flex justify-between items-center border-b border-slate-200 pb-6 dark:border-gray-600">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-gray-100">Create New Lesson</h2>
                    <p className="text-slate-500 mt-1 dark:text-gray-400">Build engaging Italian lessons for your students</p>
                </div>
                <div className="flex gap-4">
                    <button type="button" onClick={onCancel} className="bg-slate-100 cursor-pointer text-slate-700 font-semibold px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">Cancel</button>
                    <button type="submit" className="bg-blue-600 text-white font-semibold cursor-pointer px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md dark:bg-blue-700 dark:hover:bg-blue-800">Save Lesson</button>
                </div>
            </div>

            {/* Lesson Details */}
            <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-100">Lesson Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-200">Lesson Title</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter lesson title" className="mt-1 block w-full input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-200">Difficulty Level</label>
                        <select value={difficulty} onChange={e => setDifficulty(e.target.value as Difficulty)} className="mt-1 block w-full input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                            {Object.values(Difficulty).map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-200">Category</label>
                        <select value={category} onChange={e => setCategory(e.target.value as Category)} className="mt-1 block w-full input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                            {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-200">Estimated Duration</label>
                        <select value={estimatedDuration} onChange={e => setEstimatedDuration(e.target.value)} className="mt-1 block w-full input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                            <option>15 mins</option>
                            <option>30 mins</option>
                            <option>45 mins</option>
                            <option>60 mins</option>
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-200">Lesson Description</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe what student will learn in this lesson" className="mt-1 block w-full input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" required />
                    </div>
                </div>
            </div>

            {/* Lesson Content */}
            <div className="space-y-6 border-t border-slate-200 pt-8 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-100">Lesson Content</h3>
                <div className="flex flex-wrap gap-4">
                    <button
                        type="button"
                        onClick={() => addSection(LessonSectionType.Vocabulary)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-gray-800 
               dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                        <VocabularyIcon />
                        <span>Add Vocabulary</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => addSection(LessonSectionType.Grammar)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-gray-800 
               dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                        <GrammarIcon />
                        <span>Add Grammar</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => addSection(LessonSectionType.Exercise)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-gray-800 
               dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                        <ExerciseIcon />
                        <span>Add Exercise</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => addSection(LessonSectionType.Media)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-gray-800 
               dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                        <MediaIcon />
                        <span>Add Media</span>
                    </button>
                </div>

                <div className="space-y-6">
                    {sections.map(section => (
                        <div key={section.id} className="border border-slate-200 p-4 rounded-lg bg-slate-50/50 dark:bg-gray-700 dark:border-gray-600 space-y-4">
                            <div className="flex justify-between items-center">
                                <h4 className="font-semibold text-blue-600 flex items-center gap-2 dark:text-blue-400">{getSectionIcon(section.type)} {section.type}</h4>
                                <button type="button" onClick={() => removeSection(section.id)} className="text-slate-400 hover:text-red-500 dark:text-gray-300"><TrashIcon /></button>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-gray-200">Section Title</label>
                                <input type="text" value={section.title} onChange={e => handleSectionChange(section.id, 'title', e.target.value)} placeholder="Enter section title..." className="mt-1 block w-full input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-gray-200">Content</label>
                                <textarea value={section.content} onChange={e => handleSectionChange(section.id, 'content', e.target.value)} placeholder="Enter Italian words with translations..." className="mt-1 block w-full input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 min-h-[100px]" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div
                                    className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 bg-white text-gray-700 
               rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200
               dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                >
                                    <UploadIcon />
                                    Upload Audio
                                </div>

                                <div
                                    className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 bg-white text-gray-700 
               rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200
               dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                >
                                    <UploadIcon />
                                    Upload Image
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </div>

            {/* Lesson Access */}
            <div className="space-y-4 border-t border-slate-200 pt-8 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-100">Lesson Access</h3>
                <div className="flex items-center gap-8">
                    <label className="flex items-center gap-2 cursor-pointer dark:text-gray-300">
                        <input type="radio" name="access" value={LessonAccess.Free} checked={access === LessonAccess.Free} onChange={() => setAccess(LessonAccess.Free)} className="h-4 w-4 text-blue-600 border-slate-300 focus:ring-blue-500 dark:bg-gray-700" />
                        Free for all users
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer dark:text-gray-300">
                        <input type="radio" name="access" value={LessonAccess.Premium} checked={access === LessonAccess.Premium} onChange={() => setAccess(LessonAccess.Premium)} className="h-4 w-4 text-blue-600 border-slate-300 focus:ring-blue-500 dark:bg-gray-700" />
                        Premium users only
                    </label>
                </div>
            </div>
            <style>{`
                .input { border-radius: 0.5rem; padding: 0.65rem 1rem; border: 1px solid #cbd5e1; width: 100%; transition: all 0.15s ease-in-out; box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); }
                .input:focus { box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4); outline: none; border-color: #3B82F6; }
                .content-btn { background-color: #F1F5F9; color: #475569; font-weight: 500; padding: 0.5rem 1rem; border-radius: 0.5rem; display: flex; align-items: center; gap: 0.5rem; transition: background-color 0.2s; border: 1px solid #E2E8F0; }
                .content-btn:hover { background-color: #E2E8F0; }
                .file-upload-btn { background-color: white; border: 2px dashed #E2E8F0; border-radius: 0.5rem; padding: 1rem; text-align: center; color: #64748B; font-weight: 500; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 0.5rem; transition: border-color 0.2s; }
                .file-upload-btn:hover { border-color: #3B82F6; color: #3B82F6; }
            `}</style>

 <button
  type="submit"
//   disabled={isLoading}
  className="w-full cursor-pointer bg-blue-600 text-white font-semibold px-4 py-3 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
>
  {/* {isLoading ? 'Saving...' : 'Save Lesson'} */}
</button>



        </form>
    );
};

export default CreateLessonForm;
