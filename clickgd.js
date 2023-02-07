import request from "./template.js";
import store from "./exg.js";
import submit_choose from "./two_ways_submit.js";
import clicksong_lyric from './clicksong_lyric.js';
const user = JSON.parse(localStorage.getItem("user"));
function clickgd(id) {
  request(`/playlist/detail?id=${id}`, {
    methods: "GET",
  })
    .then((data) => {
      console.log(data);
     
      store.action.setSongAPI(data.playlist.tracks);
      let comment = document.querySelector(".comment");
      let comment_con = document.querySelector(".comment_con");
      let comment_ul = document.querySelector(".comment_ul");
      let submit = document.querySelector(".submit");
      let textarea = document.querySelector("textarea");
      let icons = document.querySelectorAll(".icon-dahuifu");
      
      let playlistDt = data.playlist;
      // 封面
      let title_img = document.querySelector(".title_img");
      const newImg = document.createElement("img");
      title_img.innerHTML = null;
      newImg.className = "newImg";
      let title_rel=document.querySelector('.title_rel');
      let title_rel_name=title_rel.querySelector('h1');
      title_rel_name.innerText=null;
      title_rel_name.innerText=playlistDt.name;
      //   console.log(that.getAttribute("src"));
      newImg.src = `${playlistDt.coverImgUrl}`;
      title_img.appendChild(newImg);
      // 歌曲列表
      let songlist_con = document.querySelector(".songlist_con");
      songlist_con.innerHTML = null;
      let song = document.querySelector(".song");
      // let comment_con=document.querySelector('.commnt_con');
      comment_con.style.display = "none";
      songlist_con.style.display = "block";
      for (var i = 0; i < playlistDt.tracks.length; i++) {
        const newli = document.createElement("li");
        newli.innerHTML = playlistDt.tracks[i].name;
        newli.classList = "newli";
        // console.log(typeof(`${playlist2.tracks[i].id}`));
        newli.setAttribute("songId", `${playlistDt.tracks[i].id}`);
        songlist_con.appendChild(newli);
      }
      let newlis = document.querySelectorAll(".newli");
      for (let i = 0; i < newlis.length; i++) {
        newlis[i].addEventListener("click", function (e) {
          const songId = e.target.getAttribute("songId");
          // console.log(songId);
          store.action.setCurrentSongIdxById(songId);
          let currentSongIdx = store.state.currentSongIdx;
          console.log(currentSongIdx);
          let music_img=document.querySelector('.music_img') ;
          let img_name=document.querySelector('.img_name');
          let img_name_p=document.querySelector('.img_name_artist');
          // console.log('img_name_p',img_name_p);
          music_img.src=playlistDt.tracks[currentSongIdx].al.picUrl;
          img_name.innerHTML=playlistDt.tracks[currentSongIdx].name;
          img_name_p.innerHTML=playlistDt.tracks[currentSongIdx].ar[0].name;
          let upload=document.querySelector('.upload');
          music_img.addEventListener('mousemove',function(){
            upload.style.display='block';
          })
          music_img.addEventListener('mouseout',function(){
            upload.style.display='none';
          })
          upload.addEventListener('mousemove',function(){
            upload.style.display='block';
          })
          upload.addEventListener('mouseout',function(){
            upload.style.display='none';
          })
          let main=document.querySelector('.main');
          upload.addEventListener('click',function(){
            main.style.display='none';
          })
          request(`/song/url?id=${songId}`, {
            methods: "GET",
          })
            .then((datasong) => {
              clicksong_lyric(songId,data);
              console.log(datasong);
              let audio = document.getElementById("audio");
              // audio.src=null;
              console.log(audio);
              audio.src = `${datasong.data[0].url}`;
              // console.log(typeof(audio.src));
              audio.load();
              audio.addEventListener("canplay", function () {
                audio.play();
              });
              let qian = document.querySelector(".icon-qianjin");
              console.log(currentSongIdx);
              qian.addEventListener(
                "click",
                async () => {
                  currentSongIdx++;
                  const res = await fetch(
                    `http://localhost:3000/song/url?id=${store.state.songs[currentSongIdx].id}`,
                    {
                      method: "get",
                      headers: {
                        "Content-type": "application/json",
                      },
                    }
                  )
                    .then((res) => {
                      const result = res.json();
                      return result;
                    })
                    .then((datasong) => {
                      // console.log(datasong);
                      // console.log(datasong.data[0].url);

                      let audio = document.getElementById("audio");
                      // audio.src=null;
                      console.log(audio);
                      audio.src = `${datasong.data[0].url}`;
                      // console.log(typeof(audio.src));
                      audio.load();
                      audio.addEventListener("canplay", function () {
                        audio.play();
                      });
                      // currentSongIdx++;
                    });
                }
              );
              let hou = document.querySelector(".icon-houtui");

                      hou.addEventListener(
                        "click",

                        async () => {
                          currentSongIdx--;
                          const res = await fetch(
                            `http://localhost:3000/song/url?id=${store.state.songs[currentSongIdx].id}`,
                            {
                              method: "get",
                              headers: {
                                "Content-type": "application/json",
                              },
                            }
                          )
                            .then((res) => {
                              const result = res.json();
                              return result;
                            })
                            .then((datasong) => {
                              // console.log(datasong);
                              // console.log(datasong.data[0].url);
                              let audio = document.getElementById("audio");
                              // audio.src=null;
                              console.log(audio);
                              audio.src = `${datasong.data[0].url}`;
                              // console.log(typeof(audio.src));
                              audio.load();
                              audio.addEventListener("canplay", function () {
                                audio.play();
                              });
                              // currentSongIdx--;
                            });
                        }
                      );
            })
            .catch((error) => console.error(error));
        });
      }
      // 点击歌曲隐藏评论
      song.addEventListener("click", function () {
        comment_con.style.display = "none";
        songlist_con.style.display = "block";
      });
      //  点击评论隐藏歌曲
      comment.addEventListener("click", function () {
        comment_con.style.display = "block";
        songlist_con.style.display = "none";
      });
      //  获取评论
      comment.addEventListener(
        "click",
        request(`/comment/playlist?id=${id}`, {
          methods: "GET",
        })
          .then((datacomment) => {
            console.log(datacomment);
            let hotComments = datacomment.hotComments;
            comment_ul.innerHTML = null;
            for (var i = 0; i < hotComments.length; i++) {
              let comment_li = document.createElement("li");
              comment_li.classList = "comment_li";
              comment_li.innerHTML =
                `<span>${hotComments[i].user.nickname}</span>` +
                ":" +
                `<span>${hotComments[i].content}</span>`;
              comment_li.querySelector("span").classList.add("postname");
              let reply = document.createElement("div");
              let icon = document.createElement("i");
              icon.classList.add("iconfont", "icon-dahuifu");
              icon.setAttribute("speaker", `${hotComments[i].user.nickname}`);
              icon.setAttribute("content", `${hotComments[i].content}`);
              // console.log(icon.getAttribute('speaker'));
              reply.appendChild(icon);
              comment_li.appendChild(reply);
              comment_ul.appendChild(comment_li);
              // console.log(comment_ul);
            }
            // 点击回复
            let icons = document.querySelectorAll(".icon-dahuifu");
            for (let i = 0; i < icons.length; i++) {
              icons[i].addEventListener("click", function (e) {
                submit_choose.mutation.setState();
                // alert('hello')
                // console.log(e.target);
                submit_choose.mutation.setSpeaker(
                  e.target.getAttribute("speaker")
                );
                console.log(submit_choose.state.speaker);
                let textarea = document.querySelector("#textarea");
                textarea.placeholder =
                  "回复" + `${submit_choose.state.speaker}`;
                // console.log(textarea.placeholder);

                submit_choose.mutation.setContent(
                  e.target.getAttribute("content")
                );

                // isreply.appendChild(content);
              });
            }
            // 发送的两种表现
            submit.addEventListener("click", function () {
              // alert('hello');
              if (submit_choose.state.state == false) {
                let my_comment = document.createElement("li");
                my_comment.classList = "my_comment";

                my_comment.innerHTML =
                  `<span>${user.profile.nickname}</span>` +
                  ":" +
                  `<span>${textarea.value}</span>`;
                comment_ul.insertBefore(my_comment, comment_ul.children[0]);
                comment_ul.querySelector("span").classList.add("postname2");
              } else {
                let isreply = document.createElement("li");
                isreply.classList = "comment_li";

                isreply.innerHTML =
                  `<span>${user.profile.nickname}</span>` +
                  ":" +
                  `<span>${textarea.value}</span>`;
                isreply.querySelector("span").classList.add("postname");
                let isreplyed = document.createElement("div");
                isreply.appendChild(isreplyed);
                isreplyed.className = "isreplyed";
                isreplyed.innerHTML =
                  `<span>${submit_choose.state.speaker}</span>` +
                  ":" +
                  `<span>${submit_choose.state.content}</span>`;
                let reply = document.createElement("div");
                let icon = document.createElement("i");
                icon.classList.add("iconfont", "icon-dahuifu");
                reply.appendChild(icon);
                isreply.appendChild(reply);
                comment_ul.insertBefore(isreply, comment_ul.children[0]);
              }
            });
          })
          .catch((error) => console.error(error))
      );
    })
    .catch((error) => console.error(error));
}
export default clickgd;
