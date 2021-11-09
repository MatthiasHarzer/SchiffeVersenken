export const copyToClipboard = (content: string | undefined) =>{
    if(!content) return;
    const el = document.createElement('textarea');
    el.value = content;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}
