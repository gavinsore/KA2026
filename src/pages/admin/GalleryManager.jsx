import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminBreadcrumbs from '../../components/admin/AdminBreadcrumbs';

const GalleryManager = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [description, setDescription] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('gallery_images')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setImages(data);
        } catch (error) {
            console.error('Error fetching images:', error);
            alert('Error loading gallery images');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            // 1. Upload to Storage
            const { error: uploadError } = await supabase.storage
                .from('gallery')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Insert into Database
            const { error: dbError } = await supabase
                .from('gallery_images')
                .insert([
                    {
                        filename: fileName,
                        description: '', // Default empty description
                        width: 0, // Optional: could get dims if needed
                        height: 0
                    }
                ]);

            if (dbError) throw dbError;

            fetchImages();
            alert('Image uploaded successfully!');
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image: ' + error.message);
        } finally {
            setUploading(false);
            e.target.value = ''; // Reset input
        }
    };

    const handleDelete = async (id, filename) => {
        if (!window.confirm('Are you sure you want to delete this image?')) return;

        try {
            // 1. Delete from Storage
            const { error: storageError } = await supabase.storage
                .from('gallery')
                .remove([filename]);

            if (storageError) console.warn('Storage delete error:', storageError);

            // 2. Delete from Database
            const { error: dbError } = await supabase
                .from('gallery_images')
                .delete()
                .eq('id', id);

            if (dbError) throw dbError;

            fetchImages();
        } catch (error) {
            console.error('Error deleting image:', error);
            alert('Error deleting image');
        }
    };

    const openEditModal = (image) => {
        setSelectedImage(image);
        setDescription(image.description || '');
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedImage(null);
        setDescription('');
    };

    const handleUpdateDescription = async (e) => {
        e.preventDefault();
        try {
            const { error } = await supabase
                .from('gallery_images')
                .update({ description })
                .eq('id', selectedImage.id);

            if (error) throw error;

            closeEditModal();
            fetchImages();
        } catch (error) {
            console.error('Error updating description:', error);
            alert('Error updating description');
        }
    };

    // Helper to get public URL
    const getImageUrl = (filename) => {
        const { data } = supabase.storage.from('gallery').getPublicUrl(filename);
        return data.publicUrl;
    };

    return (
        <div className="min-h-screen py-10 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <AdminBreadcrumbs />
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Gallery Manager</h1>
                    <div>
                        <label className={`cursor-pointer bg-forest-600 text-white px-4 py-2 rounded-lg hover:bg-forest-700 transition-colors flex items-center gap-2 shadow-md ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            {uploading ? 'Uploading...' : 'Upload Image'}
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileUpload}
                                disabled={uploading}
                            />
                        </label>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12">Loading...</div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {images.map((image) => (
                            <div key={image.id} className="relative group bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                                <div className="aspect-square relative bg-gray-100">
                                    <img
                                        src={getImageUrl(image.filename)}
                                        alt={image.description || 'Gallery Image'}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => openEditModal(image)}
                                            className="p-2 bg-white rounded-full text-indigo-600 hover:text-indigo-800 transition-colors"
                                            title="Edit Description"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(image.id, image.filename)}
                                            className="p-2 bg-white rounded-full text-red-600 hover:text-red-800 transition-colors"
                                            title="Delete Image"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="p-3">
                                    <p className="text-xs text-gray-500 truncate" title={image.description || 'No description'}>
                                        {image.description || <span className="italic text-gray-400">No description</span>}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {!loading && images.length === 0 && (
                    <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow">
                        No images found. Upload some to get started!
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={closeEditModal}></div>
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full relative z-50">
                            <form onSubmit={handleUpdateDescription}>
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                        Edit Image Description
                                    </h3>
                                    <div className="mb-4">
                                        {selectedImage && (
                                            <img
                                                src={getImageUrl(selectedImage.filename)}
                                                alt="Preview"
                                                className="w-full h-48 object-cover rounded-md mb-4"
                                            />
                                        )}
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            rows="3"
                                            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-forest-500 focus:border-forest-500 sm:text-sm"
                                            placeholder="Enter image description..."
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="submit"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        onClick={closeEditModal}
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GalleryManager;
