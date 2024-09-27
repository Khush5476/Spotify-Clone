"use client"

import useUploadModal from "@/hooks/useUploadModal";
import Modal from "./Modal";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import toast from "react-hot-toast";
import { useUser } from "@/hooks/UseUser";
import uniqid from "uniqid";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";

const UploadModal = () => {
    const [isLoading, setIsLoading] = useState(false);
    const uploadModal = useUploadModal();
    const { user } = useUser();
    const supabaseClient = useSupabaseClient();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        reset
    } = useForm<FieldValues>({
        defaultValues: {
            author: '',
            title: '',
            song: null,
            image: null,
            lyrics: null,
        }
    });

    const onChange = (open: boolean) => {
        if (!open) {
            reset();
            uploadModal.onClose();
        }
    };

    const onSubmit: SubmitHandler<FieldValues> = async (values) => {
        try {
            setIsLoading(true);

            const imageFile = values.image?.[0];
            const songFile = values.song?.[0];
            const lyricsFile = values.lyrics?.[0];

            if (!imageFile || !songFile || !user) {
                toast.error('Missing fields');
                return;
            }

            const uniqueID = uniqid();

            // Upload song file
            const { data: songData, error: songError } = await supabaseClient
                .storage
                .from('songs')
                .upload(`song-${values.title}-${uniqueID}`, songFile, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (songError) {
                setIsLoading(false);
                console.error('Song upload error:', songError);
                return toast.error('Failed song upload');
            }

            // Upload image file
            const { data: imageData, error: imageError } = await supabaseClient
                .storage
                .from('images')
                .upload(`image-${values.title}-${uniqueID}`, imageFile, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (imageError) {
                setIsLoading(false);
                console.error('Image upload error:', imageError);
                return toast.error('Failed image upload');
            }

            // Upload lyrics file (if provided)
            let lyricsPath = null;
            if (lyricsFile) {
                const { data: lyricsData, error: lyricsError } = await supabaseClient
                    .storage
                    .from('lyrics')
                    .upload(`lyrics-${values.title}-${uniqueID}`, lyricsFile, {
                        cacheControl: '3600',
                        upsert: false
                    });

                if (lyricsError) {
                    setIsLoading(false);
                    console.error('Lyrics upload error:', lyricsError);
                    return toast.error('Failed lyrics upload');
                }
                lyricsPath = lyricsData.path;
            }

            // Insert metadata into database
            const { error: supabaseError } = await supabaseClient
                .from('songs1')
                .insert({
                    user_id: user.id,
                    title: values.title,
                    author: values.author,
                    image_path: imageData.path,
                    song_path: songData.path,
                    lyrics_path: lyricsPath
                });

            if (supabaseError) {
                setIsLoading(false);
                console.error('Database insert error:', supabaseError);
                return toast.error(supabaseError.message);
            }

            router.refresh();
            setIsLoading(false);
            toast.success('Song created!');
            reset();
            uploadModal.onClose();

        } catch (error) {
            toast.error("Something went wrong");
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            title="Add a song"
            description="Upload a song, image, and lyrics PDF"
            isOpen={uploadModal.isOpen}
            onChange={onChange}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
                <Input id="title" disabled={isLoading} {...register('title', { required: true })} placeholder="Song title" />
                <Input id="author" disabled={isLoading} {...register('author', { required: true })} placeholder="Song Author" />

                <div>
                    <div className="pb-1">
                        Select A Song File
                    </div>
                    <Input id="song" type="file" disabled={isLoading} accept=".mp3" {...register('song', { required: true })} />
                </div>

                <div>
                    <div className="pb-1">
                        Select An Image
                    </div>
                    <Input id="image" type="file" disabled={isLoading} accept="image/*" {...register('image', { required: true })} />
                </div>

                <div>
                    <div className="pb-1">
                        Select Lyrics PDF (Optional)
                    </div>
                    <Input id="lyrics" type="file" disabled={isLoading} accept=".pdf" {...register('lyrics')} />
                </div>

                <Button disabled={isLoading} type="submit">
                    Create
                </Button>
            </form>
        </Modal>
    );
};

export default UploadModal;