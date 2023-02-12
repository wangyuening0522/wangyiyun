// 处理模块点击，适用模块有：发现音乐，创建的歌单，收藏的歌单，设置
export function handleModelClick(block){
    let main=document.querySelector('.main');
    let findMusic=document.querySelector('.findMusic');
    let setting_page=document.querySelector('.setting_page');
    main.style.display='none';
    findMusic.style.display='none';
    setting_page.style.display='none';
    block.style.display='block';
    console.log(('我被使用了'));
}
