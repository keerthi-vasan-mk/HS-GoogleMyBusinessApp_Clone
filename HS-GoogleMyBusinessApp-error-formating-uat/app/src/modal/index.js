import React from 'react';
import { render } from 'react-dom';
import NewPostModal from '@/modal/NewPostModal';
import EditPostModal from '@/modal/EditPostModal';
import '@/modal/styles/index.scss';

window.postId
  ? render(<EditPostModal postId={window.postId} token={window.auth} />, document.getElementById('modal-root'))
  : render(<NewPostModal token={window.auth} />, document.getElementById('modal-root'));