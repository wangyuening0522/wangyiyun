class Submit_choose{
   constructor(){
     this.state={
       state:false,
       speaker:[],
       content:[],
     };
     this.mutation={
       setState:()=>this.state.state=true,
       setSpeaker:(speaker)=>this.state.speaker=speaker,
       setContent:(content)=>this.state.content=content,
     }
   }
}
export default new Submit_choose();