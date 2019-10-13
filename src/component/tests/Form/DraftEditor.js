import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { RichUtils } from 'draft-js';
import clearFormatting from 'draft-js-clear-formatting'
import Editor from 'draft-js-plugins-editor'
import { Tooltip, Grid } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  editor: {
    border: '1px solid',
    padding: 10,
    borderRadius: 4,
    backgroundColor: theme.palette.background.paper
  },
  btn: {
    background: '#999',
    color: '#fff',
    border: 'none',
    padding: '.5em',
    cursor: 'pointer',
    marginBottom: '1em',
    marginRight: '1em',
    borderRadius: '.2em',
    '&:hover': {
      background: '#888',
    }
  },
}));

export default function DraftEditor(props) {
  const classes = useStyles();

  const onChange = editorState => {
    props.handleDraftChange(editorState)
  }

  const handleKeyCommand = command => {
    const newState = RichUtils.handleKeyCommand(props.contents, command);

    if (newState) {
      onChange(newState);
      return 'handled';
    }

    return 'not-handled';
  }

  const onUnderlineClick = e => {
    e.preventDefault()
    onChange(RichUtils.toggleInlineStyle(props.contents, 'UNDERLINE'));
  }

  const onToggleCode = e => {
    e.preventDefault()
    onChange(RichUtils.toggleCode(props.contents));
  }

  return (
    
    <Grid container direction="column" className={classes.editor}>
      <Grid item>
        <button 
          onClick={onUnderlineClick}
          className={classes.btn}
        >
          Underline
        </button>

        <Tooltip title="CTRL+J">
          <button 
            onClick={onToggleCode}
            className={classes.btn}
          >
            Code Block
          </button>
        </Tooltip>
      </Grid>

      <Grid item>
        <Editor
          editorState={props.contents}
          onChange={onChange}
          handleKeyCommand={handleKeyCommand}
        />
      </Grid>
      <style type="text/css">
        {`
        pre {
          border: 1px solid #ccc;
          background: #f0f0f0;
          border-radius: .2em;
          padding: .5em;
          margin: 0;
        }

        pre > pre {
          background: none;
          border: none;
          padding: 0;
        }
        `}
      </style>
    </Grid>
      
    
  );
}