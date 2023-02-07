
class Store {
  constructor() {
    this.state = {
      songs: [],
      currentSongIdx: -1,
    };
    this.mutations = {
      setSong: (data) => this.state.songs = data,
      setCurrentSongIdx: (idx) => this.state.currentSongIdx = idx,
    };
    this.action = {
      setSongAPI: (data) => this.setSongAPI(data),
      setCurrentSongIdxById: (id) => this.setCurrentSongIdxById(id),
    };
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
