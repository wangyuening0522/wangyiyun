import store from "./exg.js";
import submit_choose from "./two_ways_submit.js";
import request from "./template.js";
import clickgd from "./clickgd.js";
import lyric from "./lyric.js";
import click_block from './click_block.js';
let data1;
const user = JSON.parse(localStorage.getItem("user"));
var touxiang = document.querySelector(".touxiang");
// let clickgd;
touxiang.innerHTML = user.profile.nickname;
touxiang.innerHTML = `<img src='${user.profile.avatarUrl}'></img>
<p class='p'>${user.profile.nickname}</p>
`;
var sidebar = document.querySelector(".sidebar");
window.addEventListener("load", async () => {
  const res = await fetch(
    "http://localhost:3000/user/playlist?uid=1771496677",
    {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((res) => {
      const result = res.json();
      return result;
    })
    .then((data) => {
      console.log(data);
      // data1=data;
      // console.log(data1);
      const playlist = data.playlist;
      const title_img = document.querySelector(".title.img");
      for (var i in playlist) {
        // console.log(playlist[i].coverImgUrl);
        // console.log(typeof(playlist[i].coverImgUrl));
        // 区分我创建的歌单和他人创建的歌单
        if (playlist[i].creator.nickname == `${user.profile.nickname}`) {
          const creatgd = document.querySelector(".creatgd");
          var li = document.createElement("li");
          li.classList = `${playlist[i].id}`;
          // console.log(li.classList);
          li.innerHTML = `${playlist[i].name}`;
          li.setAttribute("src", playlist[i].coverImgUrl);
          // console.log(li);
          creatgd.appendChild(li);
        } else {
          const collectgd = document.querySelector(".collectgd");
          var li = document.createElement("li");
          li.setAttribute("src", playlist[i].coverImgUrl);
          li.classList = `${playlist[i].id}`;
          // console.log(li.classList);
          li.innerHTML = `${playlist[i].name}`;
          li.setAttribute("src", playlist[i].coverImgUrl);
          // console.log(li);
          collectgd.appendChild(li);
        }
      }
      const creatgd = document.querySelector(".creatgd");
      const collectgd = document.querySelector(".collectgd");
      // console.log("creatgd", creatgd.innerHTML);
      const creatgds = creatgd.getElementsByTagName("li");
      const collectgds = collectgd.getElementsByTagName("li");
      // 我创建的所有歌单
      for (var u = 0; u < creatgds.length; u++) {
        const that = creatgds[u];
        that.addEventListener("click", async () => {
          main.style.display = "block";
          findMusic.style.display = "none";
          const res = await fetch(
            `http://localhost:3000/playlist/detail?id=${Number(
              that.className
            )}`,
            {
              method: "get",
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
            .then((res) => {
              const result = res.json();
              return result;
            })
            .then((datacreatgd) => {
              // console.log(this.className);
              console.log(datacreatgd);
              store.action.setSongAPI(datacreatgd.playlist.tracks);
              const playlist2 = datacreatgd.playlist;
              // let songlist_con = document.querySelector(".songlist_con");

              // 创建歌单的列表
              let songlist_con = document.querySelector(".songlist_con");
              songlist_con.innerHTML = null;
              let comment = document.querySelector(".comment");
              let comment_con = document.querySelector(".comment_con");
              comment.addEventListener("click", async () => {
                songlist_con.style.display = "none";
                const res = await fetch(
                  `http://localhost:3000/comment/playlist?id=${Number(
                    that.className
                  )}`
                );
              });
              let song = document.querySelector(".song");
              song.addEventListener("click", function () {
                comment_con.style.display = "none";
                songlist_con.style.display = "block";
              });
              // 歌曲列表
              for (var i = 0; i < playlist2.tracks.length; i++) {
                const newli = document.createElement("li");
                newli.innerHTML = playlist2.tracks[i].name;
                newli.classList = "newli";
                // console.log(typeof(`${playlist2.tracks[i].id}`));
                newli.setAttribute("songId", `${playlist2.tracks[i].id}`);
                songlist_con.appendChild(newli);
              }
              var newlis = document.querySelectorAll(".newli");
              for (var j = 0; j < newlis.length; j++) {
                const current = newlis[j];
                // console.log(current.songid);
                // 点击当前歌曲来通过获取此歌曲的id，请求得到此歌曲的url
                current.addEventListener("click", async (e) => {
                  const songId = e.target.getAttribute("songId");
                  store.action.setCurrentSongIdxById(songId);
                  const res = await fetch(
                    `http://localhost:3000/song/url?id=${songId}`,
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
                      // 设置前进歌曲效果
                      let qian = document.querySelector(".icon-qianjin");
                      let currentSongIdx = store.state.currentSongIdx;
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
                      //  设置后退效果
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
                    });
                });
              }
            });
          const title_img = document.querySelector(".title_img");
          const newImg = document.createElement("img");
          title_img.innerHTML = null;
          newImg.className = "newImg";
          console.log(that.getAttribute("src"));
          newImg.src = `${that.getAttribute("src")}`;
          title_img.appendChild(newImg);
        });
      }
      //  收藏歌单详情

      for (var u = 0; u < collectgds.length; u++) {
        const that = collectgds[u];
        that.addEventListener("click", async () => {
          // let comment_con=document.querySelector('.comment');
          let songlist_con = document.querySelector(".songlist_con");
          main.style.display = "block";
          findMusic.style.display = "none";
          // comment_con.style.display='none';
          songlist_con.style.display = "block";
          const res = await fetch(
            `http://localhost:3000/playlist/detail?id=${Number(
              that.className
            )}`,
            {
              method: "get",
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
            .then((res) => {
              const result = res.json();
              return result;
            })
            .then((data) => {
              // console.log(this.className);
              console.log("------", data);
              store.action.setSongAPI(data.playlist.tracks);
              const playlist2 = data.playlist;
              let songlist_con = document.querySelector(".songlist_con");
              songlist_con.innerHTML = null;
              // 收藏歌单的评论
              // let songlist_con =
              // document.querySelector(".songlist_con");
              let comment = document.querySelector(".comment");
              let comment_con = document.querySelector(".comment_con");
              let comment_ul = document.querySelector(".comment_ul");
              let submit = document.querySelector(".submit");
              let textarea = document.querySelector("textarea");
              let icons = document.querySelectorAll(".icon-dahuifu");
              console.log(comment_ul);
              comment.addEventListener("click", async () => {
                songlist_con.style.display = "none";
                comment_con.style.display = "block";
                const res = await fetch(
                  `http://localhost:3000/comment/playlist?id=${Number(
                    that.className
                  )}`,
                  {
                    method: "get",
                    headers: {
                      "Content-Type": "application/json",
                    },
                  }
                )
                  .then((res) => res.json())
                  .then((data) => {
                    console.log("comment:", data);
                    let hotComments = data.hotComments;
                    console.log(comment_ul);
                    comment_ul.innerHTML = null;
                    for (var i = 0; i < hotComments.length; i++) {
                      let comment_li = document.createElement("li");
                      comment_li.classList = "comment_li";
                      comment_li.innerHTML =
                        `<span>${hotComments[i].user.nickname}</span>` +
                        ":" +
                        `<span>${hotComments[i].content}</span>`;
                      comment_li
                        .querySelector("span")
                        .classList.add("postname");
                      let reply = document.createElement("div");
                      let icon = document.createElement("i");
                      icon.classList.add("iconfont", "icon-dahuifu");
                      icon.setAttribute(
                        "speaker",
                        `${hotComments[i].user.nickname}`
                      );
                      icon.setAttribute("content", `${hotComments[i].content}`);
                      // console.log(icon.getAttribute('speaker'));
                      reply.appendChild(icon);
                      comment_li.appendChild(reply);
                      comment_ul.appendChild(comment_li);
                      // console.log(comment_ul);
                    }
                    for (var i = 0; i < icons.length; i++) {
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
                    submit.addEventListener("click", function () {
                      // alert('hello');
                      if (submit_choose.state.state == false) {
                        let my_comment = document.createElement("li");
                        my_comment.classList = "my_comment";
                        my_comment.innerHTML =
                          `<span>${user.profile.nickname}</span>` +
                          ":" +
                          `<span>${textarea.value}</span>`;
                        comment_ul.insertBefore(
                          my_comment,
                          comment_ul.children[0]
                        );
                        comment_ul
                          .querySelector("span")
                          .classList.add("postname2");
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
                        comment_ul.insertBefore(
                          isreply,
                          comment_ul.children[0]
                        );
                      }
                    });
                  });
              });
              let song = document.querySelector(".song");
              song.addEventListener("click", function () {
                comment_con.style.display = "none";
                songlist_con.style.display = "block";
              });
              for (var i = 0; i < playlist2.tracks.length; i++) {
                const newli = document.createElement("li");
                newli.innerHTML = playlist2.tracks[i].name;
                newli.classList = "newli";
                newli.setAttribute("songid", `${playlist2.tracks[i].id}`);
                songlist_con.appendChild(newli);
              }
              var newlis = document.querySelectorAll(".newli");
              for (var j = 0; j < newlis.length; j++) {
                const current = newlis[j];
                // console.log(current.songid);
                current.addEventListener("click", async (e) => {
                  const songId = e.target.getAttribute("songid");
                  store.action.setCurrentSongIdxById(songId);
                  let currentSongIdx = store.state.currentSongIdx;
                  // const currentidx=store.action.setCurrentSongIdxById(songId);
                  console.log("store", store);
                  const res = await fetch(
                    `http://localhost:3000/song/url?id=${songId}`,
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

                      // 设置前进歌曲效果
                      let qian = document.querySelector(".icon-qianjin");
                      console.log(e.target);
                      // console.log(store.state.currentSongIdx);
                      console.log(store.state.songs[currentSongIdx].id);
                      // console.log(store.state.songs[currentSongIdx].id);
                      qian.addEventListener("click", async () => {
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
                            console.log(store.state.songs[currentSongIdx].id);
                            // currentSongIdx++;
                            console.log(store.state.songs[currentSongIdx].id);
                            // 收藏歌单的评论
                            let songlist_con =
                              document.querySelector(".songlist_con");
                            let comment = document.querySelector(".comment");
                            let comment_con =
                              document.querySelector(".comment_con");
                            comment.addEventListener("click", async () => {
                              songlist_con.style.display = "none";
                              const res = await fetch(
                                `http://localhost:3000/comment/playlist?id=${Number(
                                  that.className
                                )}`
                              );
                            });
                            let song = document.querySelector(".song");
                            song.addEventListener("click", function () {
                              comment_con.style.display = "none";
                              songlist_con.style.display = "block";
                            });
                          });
                      });
                      //  设置后退效果
                      let hou = document.querySelector(".icon-houtui");

                      hou.addEventListener("click", async () => {
                        currentSongIdx--;
                        const res = await fetch(
                          `http://localhost:3000/song/url?id=${currentlast.songid}`,
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
                      });
                    });
                });
              }
            });
          const title_img = document.querySelector(".title_img");
          const newImg = document.createElement("img");
          title_img.innerHTML = null;
          newImg.className = "newImg";
          console.log(that.getAttribute("src"));
          newImg.src = `${that.getAttribute("src")}`;
          title_img.appendChild(newImg);
        });
      }
    });
});
var sidebar = document.querySelector(".sidebar");
sidebar.addEventListener("mouseout", function () {
  this.style.overflowY = "hidden";
});
sidebar.addEventListener("mouseover", function () {
  this.style.overflowY = "auto";
});
// // console.log(typeof(clickgd));
// // var menuItems = document.querySelectorAll("li");
// const creatgd = document.querySelector(".creatgd");
// const creatgds = creatgd.getElementsByTagName("li");
// console.log("creatgds", creatgds);
// // window.addEventListener('load',function(){
// console.log(Array.from(creatgds))
console.log(data1);
// let sidebar=document.querySelector('.sidebar');
let find = sidebar.querySelector("h3");
let main = document.querySelector(".main");

let findMusic = document.querySelector(".findMusic");
main.style.display = "none";
// findMusic.style.display = "block";
// findMusic.addEventListener("click", function () {
//   main.style.display = "none";
//   findMusic.style.display = "block";
// });
// let gdlist=document.querySelector('.gdlist');
// let gdlist_li=.querySelector('')
let gdlist_ul = document.querySelector(".gdlist_ul");
let gd = document.querySelector(".gd");
let gdlist_li = document.querySelector(".gdlist_li");
let gdlist_img = gdlist_li.querySelector("img");
let gdlist_word = gdlist_li.querySelector(".gdlist_word");
let play_count = gdlist_li.querySelector(".play_count");
let jinpin = document.querySelector(".jinpin");
let gdlist = document.querySelector(".gdlist");
let shouye = document.querySelector(".shouye");
gd.addEventListener("click", function () {
  jinpin.style.display = "block";
  gdlist.style.display = "block";
  shouye.style.display = "none";
});
let recommend = document.querySelector(".recommend");
recommend.addEventListener("click", function () {
  jinpin.style.display = "none";
  gdlist.style.display = "none";
  shouye.style.display = "block";
});
gd.addEventListener(
  "click",
  request("/top/playlist?limit=20&order=hot", {
    methods: "GET",
  })
    .then((data) => {
      console.log(data);
      let playlists = data.playlists;
      // gdlist_li.style.display='none';
      gdlist_img.src = playlists[0].coverImgUrl;
      gdlist_word.innerHTML = playlists[0].name;
      play_count.innerText = playlists[0].playCount;
      // console.log(gdlist_li.getAttribute('id'));
      for (let i = 1; i < playlists.length; i++) {
        // console.log(playlists[i].name);
        let cloneNode = gdlist_li.cloneNode(true);
        gdlist_ul.appendChild(cloneNode);
        gdlist_img.src = playlists[i].coverImgUrl;
        gdlist_word.innerHTML = playlists[i].name;
        play_count.innerText = playlists[i].playCount;
      }
      let gdlist_lis = document.querySelectorAll(".gdlist_li");
      for (let i = 0; i < playlists.length; i++) {
        gdlist_lis[i].setAttribute("songid", playlists[i].id);
        gdlist_lis[i].addEventListener("click", function (e) {
          main.style.display = "block";
          findMusic.style.display = "none";
          // console.log(typeof(e.currentTarget));
          let id = e.currentTarget.getAttribute("songid");
          clickgd(id);
        });
      }
    })
    .catch((error) => console.error(error))
);
let sort_li = document.querySelector(".sort_li");
let allgd = document.querySelector(".allgd");
let sort_ul = document.querySelector(".sort_ul");
let sort = document.querySelector(".sort");
let count = 1;
allgd.addEventListener("click", function () {
  sort.style.display = "block";
  if (count % 2 != 0) {
    count++;
    request("/playlist/catlist", {
      methods: "GET",
    })
      .then((data) => {
        // console.log(data);
        let playsub = data.sub;
        sort_li.innerHTML = playsub[0].name;
        for (let i = 1; i < 40; i++) {
          // console.log(playsub[i].name);
          let cloneNode = sort_li.cloneNode(true);
          cloneNode.innerHTML = playsub[i].name;
          sort_ul.appendChild(cloneNode);
        }
      })
      .catch((error) => console.error(error));
  } else {
    sort.style.display = "none";
    count++;
    sort_ul.innerHTML = null;
  }
});
sort_ul.addEventListener("click", function (e) {
  sort.style.display = "none";
  gdlist_ul.innerHTML = null;
  request(`/top/playlist?limit=10&order=hot&cat=${e.target.innerText}`, {
    methods: "GET",
  })
    .then((data) => {
      console.log(data);
      let playlists = data.playlists;
      for (let i = 0; i < playlists.length; i++) {
        // console.log(playlists[i].name);
        let cloneNode = gdlist_li.cloneNode(true);
        gdlist_ul.appendChild(cloneNode);
        gdlist_img.src = playlists[i].coverImgUrl;
        gdlist_word.innerHTML = playlists[i].name;
        play_count.innerText = playlists[i].playCount;
      }
    })
    .catch((error) => console.error(error));
});
// 请求搜索框热门
let search_div = document.querySelector(".search_div");
let search_hint = document.querySelector(".search_hint");
// let main=document.querySelector('.main');
// let findMusic=document.querySelector('.findMusic');
findMusic.addEventListener("click", function () {
  search_hint.style.display = "none";
 
});
main.addEventListener("click", function () {
  search_hint.style.display = "none";
});
search_div.addEventListener("click", function () {
  search_hint.style.display = "block";
  request("/search/hot", {
    methods: "GET",
  })
    .then((data) => {
      console.log(data);
      let hots = data.result.hots;
      for (let i = 0; i < hots.length; i++) {
        let newli = document.createElement("li");
        newli.innerHTML = hots[i].first;
        newli.className = "hots";
        let search_ol = document.querySelector(".search_ol");
        // console.log(search_ol);
        search_ol.appendChild(newli);
      }
    })
    .catch((error) => console.error(error));
});
let search_ipt = search_div.querySelector("input");
// let search_hint=document.querySelector('.search_hint');
search_ipt.addEventListener("keyup", function (event) {
  if (event.code == "NumpadEnter" || event.code == "Enter") {
    request(`/search?keywords=${search_ipt.value}`, {
      methods: "GET",
    }).then((data) => {
      console.log(data);

      search_hint.style.display = "none";
      let search_con = document.querySelector(".search_con");
      let findMusic = document.querySelector(".findMusic");
      let main = document.querySelector(".main");
      findMusic.style.display = "none";
      main.style.display = "none";
      search_con.style.display = "block";
      let search_ul = document.querySelector(".search_ul");
      let search_title = search_con.querySelector(".search_title");
      console.log(search_title);
      let search_h3 = search_title.querySelector("h3");
      // console.log(search_h3);
      search_h3.style.display = "block";
      search_h3.innerText = "搜索" + search_ipt.value;
      let songs = data.result.songs;
      store.action.setSongAPI(songs);
      // let search_ul=document.querySelector('.search_ul');
      for (let j = 0; j < songs.length; j++) {
        let newli = document.createElement("li");
        newli.className = "search_li";
        let name = document.createElement("span");
        name.innerHTML = songs[j].name;
        let artists = document.createElement("span");
        artists.innerHTML = songs[j].artists[0].name;
        // console.log(songs[j].artists[0].name);
        let album = document.createElement("span");
        album.innerHTML = songs[j].album.name;
        name.className = "search_name";
        artists.className = "artists";
        album.className = "album";
        newli.appendChild(name);
        newli.appendChild(artists);
        newli.appendChild(album);
        // console.log(newli);
        search_ul.appendChild(newli);
        // newli.className='newli';
        newli.setAttribute("songid", songs[j].id);
      }
      // 点击唱歌，并且上下切歌
      let newlis = document.querySelectorAll(".search_li");
      for (let i = 0; i < newlis.length; i++) {
        newlis[i].addEventListener("click", function (e) {
          console.log(e.currentTarget);
          const songid = e.currentTarget.getAttribute("songid");
          console.log(songid);
          store.action.setCurrentSongIdxById(songid);
          let currentSongIdx = store.state.currentSongIdx;
          console.log(currentSongIdx);
          request(`/song/url?id=${songid}`, {
            methods: "GET",
          })
            .then((datasong) => {
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
              qian.addEventListener("click", async () => {
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
              });
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
    });
  }
});
let search_con = document.querySelector(".search_con");
let sidebar_find = document.querySelector(".sidebar_find");

sidebar_find.addEventListener("click", function () {
  let shouye=document.querySelector('.shouye');
  findMusic.style.display = "block";
  shouye.style.display='block';
  main.style.display = "none";
  search_con.style.display = "none";
  click_block(findMusic);
});
request("/personalized?limit=10", {
  mathods: "GET",
}).then((datatj) => {
  console.log("datatj", datatj);
  // let creatives = datatj.data.blocks[1].creatives;
  let result = datatj.result;
  // console.log(creatives);
  let tj_li = document.querySelector(".tj_li");
  let tj_img = tj_li.querySelector("img");
  let tj_word = document.querySelector(".tj_word");
  let tj_count = document.querySelector(".tj_count");
  let tj_ul = document.querySelector(".tj_ul");
  tj_img.src = result[0].picUrl;
  tj_word.innerHTML = result[0].name;
  tj_count.innerText = result[0].playCount;

  // clickgd(result[0].id);
  for (let i = 1; i < result.length; i++) {
    let cloneNode = tj_li.cloneNode(true);
    tj_ul.appendChild(cloneNode);
    tj_img.src = result[i].picUrl;
    tj_word.innerHTML = result[i].name;
    tj_count.innerText = result[i].playCount;
    // clickgd(result[i].id);
  }
  let tj_lis = document.querySelectorAll(".tj_li");
  for (let i = 0; i < result.length; i++) {
    tj_lis[i].setAttribute("songid", result[i].id);
    tj_lis[i].addEventListener("click", function (e) {
      let shouye = document.querySelector(".shouye");
      let main = document.querySelector(".main");
      main.style.display = "block";
      shouye.style.display = "none";
      findMusic.style.display = "none";
      // console.log(typeof(e.currentTarget));
      let id = e.currentTarget.getAttribute("songid");
      clickgd(id);
    });
  }
  // 通过首页发现获得
  // tj_img.src = creatives[0].uiElement.image.imageUrl;
  // tj_word.innerHTML = creatives[0].uiElement.mainTitle.title;
  // tj_count.innerText = creatives[0].resources[0].resourceExtInfo.playCount;
  // for (let i = 0; i < creatives.length; i++) {
  //   if ((i==0)) {
  //     for (let j = 1; j < creatives[i].resources.length; j++) {
  //       let cloneNode = tj_li.cloneNode(true);
  //       tj_ul.appendChild(cloneNode);
  //       let uiElement = creatives[i].resources[j].uiElement;
  //       tj_img.src = uiElement.image.imageUrl;
  //       tj_word.innerHTML = uiElement.mainTitle.title;
  //       tj_count.innerText =
  //         creatives[i].resources[j].resourceExtInfo.playCount;
  //     }
  //   } else {
  //     for (let j = 0; j < creatives[i].resources.length; j++) {
  //       let cloneNode = tj_li.cloneNode(true);
  //       tj_ul.appendChild(cloneNode);
  //       let uiElement = creatives[i].resources[j].uiElement;
  //       tj_img.src = uiElement.image.imageUrl;
  //       tj_word.innerHTML = uiElement.mainTitle.title;
  //       tj_count.innerText =
  //         creatives[i].resources[j].resourceExtInfo.playCount;
  //     }
  //   }
  // }
  // 最新音乐及播放
  let lastMusic_li = document.querySelector(".lastMusic_li");
  let lastMusic_ul = document.querySelector(".lastMusic_ul");
  let lm_img = lastMusic_li.querySelector("img");
  let lm_name = document.querySelector(".lm_name");
  let lm_artist = document.querySelector(".lm_artist");
  request("/personalized/newsong?limit=12", {
    method: "GET",
  }).then((datalm) => {
    console.log("datalm", datalm);
    let resultlm = datalm.result;
    lm_img.src = resultlm[0].picUrl;
    lm_name.innerHTML = resultlm[0].name;
    lm_artist.innerHTML = resultlm[0].song.artists[0].name;
    lastMusic_li.setAttribute("songid", resultlm[0].id);
    for (let i = 1; i < resultlm.length; i++) {
      let clone = lastMusic_li.cloneNode(true);
      lastMusic_ul.appendChild(clone);
      lm_img.src = resultlm[i].picUrl;
      lm_name.innerHTML = resultlm[i].name;
      // console.log(resultlm[i]);
      // console.log(resultlm[i].song);
      lm_artist.innerHTML = resultlm[i].song.artists[0].name;
      clone.setAttribute("songid", resultlm[i].id);
    }
    for (let i = 0; i < resultlm.length; i++) {
      let lastMusic_lis = document.querySelectorAll(".lastMusic_li");
      lastMusic_lis[i].addEventListener("click", function (e) {
        let id = e.currentTarget.getAttribute("songid");
        // let datalm=e.currentTarget.getAttribute("datalm");
        request(`/song/url?id=${id}`, {
          method: "GET",
        }).then((data) => {
          lyric(id);
          let songName = document.querySelector(".songName");
          let songartist = document.querySelector(".songartist");
          store.state.songs = null;
          store.state.songs = datalm.result;
          store.action.setCurrentSongIdxById(id);
          let currentSongIdx = store.state.currentSongIdx;
          songName.innerHTML = datalm.result[currentSongIdx].name;
          songartist.innerHTML =
            datalm.result[currentSongIdx].song.artists[0].name;
          let lyric_left = document.querySelector(".lyric_left");
          let newimg = document.createElement("img");
          newimg.src = datalm.result[currentSongIdx].picUrl;
          newimg.className = "newimg";
          lyric_left.appendChild(newimg);
          console.log(data);
          let audio = document.getElementById("audio");
          // audio.src=null;
          console.log(audio);
          audio.src = `${data.data[0].url}`;
          // console.log(typeof(audio.src));
          audio.load();
          audio.addEventListener("canplay", function () {
            audio.play();
          });
        });
      });
    }
  });
});
request("/banner?type=0", {
  method: "GET",
}).then((data) => {
  console.log(data);
  let timer = setInterval(get_nex, 3000);
  let banners = data.banners;
  let sz = new Array();
  let szdiv = new Array();
  let cur_ul = document.getElementById("banner");
  let bottom_divs = document.querySelectorAll(".bottom_div");
  for (let i = 1; i <= banners.length; i++) {
    let cur_li = document.createElement("li");
    cur_li.className = "cur_li";
    cur_li.style.width = "50%";
    cur_li.style.height = "200px";
    let cur_img = document.createElement("img");
    cur_img.src = banners[i - 1].imageUrl;
    cur_img.style.width = "100%";
    cur_img.style.height = "200px";
    cur_li.appendChild(cur_img);
    cur_ul.appendChild(cur_li);
    sz.push(cur_li);
    // sz[sz.length - 1].style.left = "0px";
    cur_li.addEventListener("mouseenter", function () {
      clearInterval(timer);
    });
    cur_li.addEventListener("mouseleave", function () {
      timer = setInterval(get_nex, 3000);
    });
    bottom_divs[i - 1].name = banners.length - i;
    szdiv.push(bottom_divs[i - 1]);
    if (i != banners.length) {
      cur_li.id = banners.length - i;
      bottom_divs[i - 1].name = banners.length - i;
    } else {
      cur_li.id = banners.length;
      bottom_divs[i - 1].name = banners.length;
    }
  }

  for (let i = 0; i < szdiv.length; i++) {
    szdiv[i].addEventListener("mouseenter", function () {
      clearInterval(timer);
      let len1 = sz[len - 1].id;
      let len2 = szdiv[i].name;
      let dis = Math.max(len1, len2) - Math.min(len1, len2);
      if (len1 > len2) {
        while (dis--) get_nex();
      } else {
        while (dis--) get_pre();
      }
    });
  }
  let len = sz.length - 1;
  sz[len].style.left = "50%";
  sz[len - 1].style.left = "25%";
  sz[len - 1].style.transform = "scale(1.3)";
  sz[len - 1].style.zIndex = 100;
  sz[len - 2].style.left = "0px";
  //   箭头
  let pre_img = document.createElement("img");
  pre_img.src = "./img/pre.png";
  pre_img.style.position = "absolute";
  pre_img.style.left = 0;
  pre_img.style.top = "100px";
  // pre_img.style.bottom = 0;
  pre_img.style.margin = "auto";
  pre_img.style.zIndex = 100;
  pre_img.style.height = "30px";
  pre_img.style.opacity = 0.6;
  pre_img.style.display = "none";
  cur_ul.appendChild(pre_img);
  let next_img = document.createElement("img");
  next_img.src = "./img/next.png";
  next_img.style.position = "absolute";
  next_img.style.right = 0;
  next_img.style.top = "100px";
  next_img.style.height = "30px";
  next_img.style.margin = "auto";
  next_img.style.zIndex = 100;
  next_img.style.opacity = 0.6;
  next_img.style.display = "none";
  cur_ul.appendChild(next_img);
  for (let i = 0; i < sz.length; i++) {
    sz[i].addEventListener("mouseenter", function () {
      next_img.style.display = "block";
      pre_img.style.display = "block";
    });
    sz[i].addEventListener("mouseleave", function () {
      next_img.style.display = "none";
      pre_img.style.display = "none";
    });
  }
  // 点击按钮前后后退
  pre_img.addEventListener("click", function () {
    clearInterval(timer);
    get_pre();
    timer = setInterval(get_pre, 3000);
  });
  next_img.addEventListener("click", function () {
    clearInterval(timer);
    get_nex();
    timer = setTimeout(get_nex, 3000);
  });
  szdiv[0].style.backgroundColor = "red";
  //   for (let i = 0; i < szdiv.length; i++) {
  //     szdiv[i].onmouseenter = function () {
  //         clearInterval(timer);
  //         let len1 = sz[len - 1].id;
  //         let len2 = szdiv[i].name;
  //         let dis = Math.max(len1, len2) - Math.min(len1, len2)
  //         if (len1 > len2) {
  //             while (dis--)
  //                 get_pre()
  //         } else {
  //             while (dis--)
  //                 get_next()
  //         }
  //         timer = setInterval(get_next,3000)
  //     }
  // }

  // 向前自动播放函数
  function get_nex() {
    let give_up = sz[0];
    sz.shift();
    sz.push(give_up);
    for (let i = 0; i < sz.length; i++) {
      sz[i].style.zIndex = i;
      sz[i].style.transform = "scale(1)";
    }
    sz[len - 2].style.left = "0px";
    sz[len - 1].style.zIndex = 100;
    sz[len - 1].style.left = "25%";
    sz[len - 1].style.transform = "scale(1.3)";
    sz[len].style.left = "50%";
    sz[len].style.opacity = 1;
    sync_szdiv();
  }
  //   向后自动播放函数
  function get_pre() {
    let give_up = sz[len];
    sz.pop();
    sz.unshift(give_up);
    for (let i = 0; i < sz.length; i++) {
      sz[i].style.zIndex = i;
      sz[i].style.transform = "scale(1)";
    }
    sz[len - 2].style.left = "0px";
    sz[len - 1].style.zIndex = 100;
    sz[len - 1].style.left = "25%";
    sz[len - 1].style.transform = "scale(1.3)";
    sz[len].style.left = "50%";
    sz[len].style.opacity = 1;
    sync_szdiv();
  }
  function sync_szdiv() {
    for (let i = 0; i < szdiv.length; i++) {
      if (szdiv[i].name == sz[len - 1].id)
        szdiv[i].style.backgroundColor = "red";
      else {
        szdiv[i].style.backgroundColor = "rgb(224,224,224)";
      }
    }
  }
});
let upload = document.querySelector(".upload");
let header = document.querySelector(".header");
// let sidebar=document.querySelector('.sidebar');
// let play=document.querySelector('.play');
let waibu = document.querySelector(".waibu");
upload.addEventListener("click", function () {
  waibu.style.display = "none";
  sidebar.style.display = "none";
  findMusic.style.display = "none";
  // play.style.display='block';
  let lyric = document.querySelector(".lyric");
  lyric.style.display = "block";
});
let down_arrow = document.querySelector(".down-arrow");
down_arrow.addEventListener("click", function () {
  let lyric = document.querySelector(".lyric");
  lyric.style.display = "none";
  let findMusic = document.querySelector(".findMusic");
  let sidebar = document.querySelector(".sidebar");
  findMusic.style.display = "block";
  sidebar.style.display = "block";
  waibu.style.display = "block";
  let shouye=document.querySelector('.shouye');
  shouye.style.display='block';
});

// let cookie = localStorage.getItem("cookie");
// const cookieValue = encodeURIComponent(cookie);
// // console.log('document.cookie:',cookieValue);
// request(`/recommend/songs?cookie=${cookieValue}`, {
//   method: "GET",
// }).then((data) => {
//   console.log("zuidata", data);
// });
let setting_page = document.querySelector(".setting_page");
let setting = document.querySelector(".setting");
setting.addEventListener("click", function () {
  findMusic.style.display = "none";
  setting_page.style.display = "block";
  click_block(setting_page);
});

//登录界面
let preserve = document.querySelector(".preserve");
preserve.addEventListener("click", function () {
  let name = document.querySelector(".name");
  let sexs = document.querySelectorAll(".sex");
  let signature = document.querySelector(".intd_span");
  let selectSex;
  for (let i = 0; i < sexs.length; i++) {
    if (sexs[i].checked) {
      selectSex = sexs[i].value;
    }
  }
  let birthday_year = document.querySelector("#birthday_year");
  let selectYearValue =
    birthday_year.options[birthday_year.selectedIndex].value;
  let birthday_month = document.getElementById("birthday_month");
  let birthday_day = document.getElementById("birthday_day");
  let selectMouthValue =
    birthday_month.options[birthday_year.selectedIndex].value;
  let selectDateValue = birthday_day.options[birthday_year.selectedIndex].value;
  let province = document.querySelector("#province");
  let selectProValue = province.options[province.selectedIndex].value;
  let city = document.querySelector("#city");
  let selectCityValue = city.options[city.selectedIndex].value;
  const birthdate = new Date(
    selectYearValue + "-" + selectMouthValue + "-" + selectDateValue
  );
  const timestamp = birthdate.getTime();
  const id = Math.floor(timestamp / 1000);
  // 参数后面带上cookie的方式，从登陆页面拿到
  // let cookie = localStorage.getItem("cookie")
  // let cookiechange=encodeURIComponent(cookie);
  // console.log(cookiechange);
  request(
    `/user/update?gender=${selectSex}&signature=${signature.innerText}&city=${selectCityValue}&nickname=${name.value}&birthday=${id}&province=${selectProValue}`,
    {
      method: "POST",
      body: JSON.stringify({
        gender: selectSex,
        signature: signature.value,
        city: selectCityValue,
        nickname: name.value,
        birthday: id,
        province: selectProValue,
      }),
    }
  ).then((data) => {
    console.log("登陆后", data);
    
//     let user = JSON.parse(localStorage.getItem("user"));
// var touxiang = document.querySelector(".touxiang");
user.profile.nickname=name.value;
// let clickgd;
touxiang.innerText = user.profile.nickname;
  });
});
// request('/user/playlist?uid=32953014',{
//   method:'GET',
// }).then(data=>{
//   console.log('登陆收2',data);
// })
