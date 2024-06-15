export const convertUrlToFile = async (url: string): Promise<File | null> => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.blob();
        const filename = url.split('/').pop() || 'file';
        return new File([data], filename, { type: data.type });
    } catch (error) {
        console.error('Error converting URL to file:', error);
        return null;
    }
}

export const convertUrlsToFile = async (urls: string[]): Promise<File[]> => {
    const files: File[] = [];
    for (const url of urls) {
        const file = await convertUrlToFile(url);
        if (file) {
            files.push(file);
        }
    }
    return files;
}