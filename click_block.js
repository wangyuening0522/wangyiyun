function click_block(block){
    let main=document.querySelector('.main');
    let findMusic=document.querySelector('.findMusic');
    let setting_page=document.querySelector('.setting_page');
    main.style.display='none';
    findMusic.style.display='none';
    setting_page.style.display='none';
    block.style.display='block';
    console.log(('我被使用了'));
}
export default click_block;