import React from 'react';
import SideBarComponent from './sidebar/sidebar';
import EditorComponent from './editor/editor';
import './App.css';

const firebase = require('firebase');

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedNoteIndex: null,
      selectedNote: null,
      notes: null
    }
  }
  render() {
    return(
      <div className="app-container">
      <SideBarComponent 
          selectedNoteIndex={this.state.selectedNoteIndex} 
          notes={this.state.notes}
          deleteNote= {this.deleteNote}
          selectNote={this.selectNote}
          newNote={this.newNote}
        >
        </SideBarComponent>
        {
          this.state.selectedNote ?
          <EditorComponent 
            selectedNote={this.state.selectedNote}
            selectedNoteIndex={this.state.selectedNoteIndex}
            notes={this.state.notes}
            updateNote={this.updateNote}>
          </EditorComponent> : null
        }
      
      </div>);
  }

  componentDidMount = () => {
    firebase
      .firestore()
      .collection("notes") //table on firebase
      .onSnapshot(serverUpdate => {
        const notes = serverUpdate.docs.map( _doc => {
          const data = _doc.data();
          data['id'] = _doc.id;
          return data;
          });
        console.log(notes);
        this.setState({ notes: notes });
      })
  }


  //highlights the note
  selectNote = (note, index) => this.setState({ selectedNoteIndex: index, selectedNote: note});
  updateNote = (id, noteObj) => {
    firebase
      .firestore()
      .collection("notes")
      .doc(id)
      .update({
        title: noteObj.title,
        body: noteObj.body,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
  }

  newNote = () => {
    
  }
}
export default App;
