//全局状态管理，导出来的对象引入对应文件
class Store {
  constructor() {
    this.state = {
      songs: [],
      currentSongIdx: -1,
      state:false,
      speaker:[],
      content:[],
    };//state定义了
    this.mutations = {
      setSong: (data) => this.state.songs = data,
      setCurrentSongIdx: (idx) => this.state.currentSongIdx = idx,
      setState:()=>this.state.state=!this.state.state,
       setSpeaker:(speaker)=>this.state.speaker=speaker,
       setContent:(content)=>this.state.content=content,
    };//mutation定义了直接修改stse中变量值的方法
    this.action = {
      setSongAPI: (data) => this.setSongAPI(data),
      setCurrentSongIdxById: (id) => this.setCurrentSongIdxById(id),
      setState:()=>{
        this.setStateApi();
      },
      setSpeaker:(speaker)=>{
        this.setSpeakerApi(speaker);
      },
      setContent:(content)=>{
        this.setContentApi(content);
      }
    };//action中定义了用户操作mutation中提供的间接修改stste中的值，只能通过mutation中暴露出来的stse值，而不能直接修改ststae值
  }
  setContentApi(content){
    this.mutations.setContent(content);
  }
  setSpeakerApi(speaker){
    this.mutations.setSpeaker(speaker);
  }
  setStateApi(){
    this.mutations.setState();
  }
  setSongAPI(data) {
    this.mutations.setSong(data);
  }
  setCurrentSongIdxById(id) {
    const temp = this.state.songs.findIndex(
      (item) => Number(item.id) === id - 0
    );
    this.mutations.setCurrentSongIdx(temp);
  }
}
export default new Store();
