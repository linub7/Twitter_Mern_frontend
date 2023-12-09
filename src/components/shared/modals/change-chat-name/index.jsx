import { BounceLoader } from 'react-spinners';
import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

import CustomLoader from 'components/shared/custom-loader';
import ModalContainer from '../modal-container';
import ChangeNameInput from 'components/messages/chat-name-input';
import { updateChatNameHandler } from 'api/chat';
import {
  setActiveConversationAction,
  updateConversationsAction,
} from 'redux-store/slices/chat';

const ChangeChatNameModal = ({
  changeChatNameLoading = false,
  chatName,
  chatId,
  token,
  setIsModalOpen = () => {},
  setChatName = () => {},
  setChangeChatNameLoading = () => {},
}) => {
  const dispatch = useDispatch();
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setChatName('');
  };

  const handleChangeChatName = useCallback(async () => {
    setChangeChatNameLoading(true);
    const values = { chatName };
    const { err, data } = await updateChatNameHandler(chatId, values, token);
    if (err) {
      console.log(err);
      setChangeChatNameLoading(false);
      return toast.error(err?.message);
    }
    setChangeChatNameLoading(false);
    handleCloseModal();
    await dispatch(setActiveConversationAction(data?.data?.data));
    await dispatch(updateConversationsAction(data?.data?.data));
  }, [chatName, chatId, dispatch, token]);

  return (
    <ModalContainer
      header={'Change Chat Name'}
      onClose={handleCloseModal}
      submitButtonTitle={'Send Reply'}
      disabled={
        !chatName.trim() || chatName?.length < 2 || changeChatNameLoading
      }
      onSubmit={handleChangeChatName}
      loading={changeChatNameLoading}
    >
      {changeChatNameLoading ? (
        <CustomLoader>
          <BounceLoader color="#9bd1f9" />
        </CustomLoader>
      ) : (
        <ChangeNameInput
          value={chatName}
          onChange={(e) => setChatName(e.target.value)}
        />
      )}
    </ModalContainer>
  );
};

export default ChangeChatNameModal;
