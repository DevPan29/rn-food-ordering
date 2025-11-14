import { Image } from 'react-native';
import React, { ComponentProps, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

type RemoteImageNoDownloadProps = {
  path?: string | null;
  fallback: string;
} & Omit<ComponentProps<typeof Image>, 'source'>;

const RemoteImageNoDownload = ({ path, fallback, ...imageProps }: RemoteImageNoDownloadProps) => {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!path) {
      setUrl(null);
      return;
    }

    (async () => {

      // 1️⃣ Controlliamo se il file esiste usando list()
      const { data: files, error: listError } = await supabase.storage
        .from('product-images')
        .list('', { search: path });  

    if (listError) {
        console.warn(`[Supabase Storage] Errore nel list:`, listError);
      } else {
        console.log(`[Supabase Storage] Files trovati:`, files);
        const { data } = await supabase.storage
        .from('product-images')
        .getPublicUrl(path);

        setUrl(data?.publicUrl ?? null);
      }

    })();
  }, [path]);

  return <Image source={{ uri: url ?? fallback }} {...imageProps} />;
};

export default RemoteImageNoDownload;
