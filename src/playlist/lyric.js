import request from "../request.js";
function lyric(id) {
  request(`/lyric?id=${id}`, {
    method: "GET",
  })
    .then((data) => {
      // console.log(data);
      // console.log(data.lrc.lyric);
      let lyric = data.lrc.lyric;
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
    })
    .catch((err) => {
      throw new Error("请求错误" + err);
    });
  request(`/simi/song?id=${id}`, {
    method: "GET",
  }).then((xsdata) => {
    console.log("xsdata", xsdata);
    let songs = xsdata.songs;
    for (let i = 0; i < songs.length; i++) {
      let newli = document.createElement("li");
      newli.innerText = songs[i].name;
      newli.className = "lyric_right_li";
      let lyric_right_ul = document.querySelector(".lyric_right_ul");
      lyric_right_ul.appendChild(newli);
    }
  });
}
export default lyric;
