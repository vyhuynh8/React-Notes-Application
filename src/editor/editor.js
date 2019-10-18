import React from 'react';
import ReactQuill from 'react-quill';
import debounce from '../helpers';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';


class EditorComponent extends React.Component {
	constructor() {
		super();
		this.state = {
			text: '',
			title: '',
			id: ''
		}
	}

	//only called for first element clicked
	componentDidMount = () => {
		this.setState({
			text: this.props.selectedNote.body,
			title: this.props.selectedNote.title,
			id: this.props.selectedNote.id
		});
	}

	//when new object is selected
	componentDidUpdate = () => {
		//diff id selected from one displaying
		if (this.props.selectedNote.id !== this.state.id) {
			this.setState({
				text: this.props.selectedNote.body,
				title: this.props.selectedNote.title,
				id: this.props.selectedNote.id
			});
		}
	}

	render() {
		const { classes } = this.props;
		return(
			<div className={classes.editorContainer}>
			<BorderColorIcon className={classes.editIcon}></BorderColorIcon>
			<input
				className={classes.titleInput}
				placeholder="Note title..."
				value={this.state.title ? this.state.title : ""}
				onChange= {(e) => this.updateTitle(e.target.value)}>
			</input>
			 <ReactQuill 
			 	value={this.state.text} 
			 	onChange={this.updateBody}>
			 </ReactQuill>
			</div>
		);
	}

	updateTitle = async (val) => {
		await this.setState({title: val});
		this.update();
	}

	updateBody = async (val) => {
		await this.setState({ text: val });
		this.update();
	};

	update = debounce(() => {
		this.props.updateNote(this.state.id, {
			title: this.state.title,
			body: this.state.text
		})
	}, 1500);


}

export default withStyles(styles)(EditorComponent);
