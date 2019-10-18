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

  newNote = async (title) => {
    const note = {
      title: title,
      body: ''
    }
    const newFromDB = await firebase
      .firestore()
      .collection("notes")
      .add({
        title: note.title,
        body: note.body,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });

    //fetching ID from the response
    const newID = newFromDB.id;

    //updating notes array
    await this.setState({ notes: [...this.state.notes, note]});

    //it returns an array so you do [0]
    const newNoteIndex = this.state.notes.indexOf(this.state.notes.filter(_note => _note.id === newID)[0]);

    this.setState({ selectedNote: this.state.notes[newNoteIndex], selectedNoteIndex: newNoteIndex});
  }


  deleteNote = async (note) => {
    const noteIndex = this.state.notes.indexOf(note);
    //await this.setState({ notes: this.state.notes.filter(_note => _note != note)});

    if (this.state.selectednoteIndex === noteIndex) {
      //if we are deleting the note we are selecting
      this.setState({ selectedNoteIndex: null, selectedNote: null});
    } else {
      //if we are deleting the note that we aren't selecting (also, theres one less element in our array)
      this.state.notes.length > 1 ?
      this.selectNote(this.state.notes[this.state.selectedNoteIndex-1], this.state.selectedNoteIndex-1) :
      this.setState({ selectedNoteIndex: null, selectedNote: null});
    }

    firebase
      .firestore()
      .collection('notes')
      .doc(note.id)
      .delete();
  }

}
export default App;
