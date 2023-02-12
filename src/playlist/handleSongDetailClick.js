import request from "../request.js";
import store from "../store.js";
function handleSongDetailClick(id, songsdata) {
  request(`/lyric?id=${id}`, {
    method: "GET",
  })
    .then((datalr) => {
      console.log("datalr", datalr);
      console.log("datalr.lrc.lyric", datalr.lrc.lyric);
      let lyric = datalr.lrc.lyric;
      let Obj = {};
      let reg = /\[(.*?)](.*)/g;
      let lyric_center = document.querySelector(".lyric_center");
      lyric.replace(reg, (a, b, c) => {
        // console.log(a,'a');
        // console.log(b,'b');
        // console.log(c,'c');
        let singleLrc = document.createElement("p");
        singleLrc.innerHTML = c;
        singleLrc.className = "singleLrc";
        lyric_center.appendChild(singleLrc);
      });
      let songname = songsdata.playlist.tracks[0].name;
      console.log("songname", songname);
      let songName = document.querySelector(".songName");
      let songartist = document.querySelector(".songartist");
      store.state.songs = null;
      store.state.songs = songsdata.playlist.tracks;
      store.action.setCurrentSongIdxById(id);
      let currentSongIdx = store.state.currentSongIdx;
      songName.innerHTML = songsdata.playlist.tracks[currentSongIdx].name;
      songartist.innerHTML =
        songsdata.playlist.tracks[currentSongIdx].ar[0].name;
      let lyric_left = document.querySelector(".lyric_left");
      let newimg = document.createElement("img");
      newimg.src = songsdata.playlist.tracks[currentSongIdx].al.picUrl;
      newimg.className = "newimg";
      lyric_left.appendChild(newimg);
      //   console.log(data);
    })
    .catch((err) => {
      throw new Error("请求错误" + err);
    });
  request(`/simi/song?id=${id}`, {
    method: "GET",
  })
    .then((xsdata) => {
      console.log("xsdata", xsdata);
      let songs = xsdata.songs;
      for (let i = 0; i < songs.length; i++) {
        let newli = document.createElement("li");
        newli.innerText = songs[i].name;
        newli.className = "lyric_right_li";
        let lyric_right_ul = document.querySelector(".lyric_right_ul");
        lyric_right_ul.appendChild(newli);
      }
    })
    .catch((err) => {
      throw new Error("请求错误" + err);
    });
}
export default handleSongDetailClick;
