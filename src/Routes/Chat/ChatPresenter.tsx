import React from "react";
import Header from "../../Components/Header";
import styled from "../../typed-components";
import { getChat, userProfile } from "../../types/api";
import Message from "../../Components/Message";
import Form from "../../Components/Form";
import Input from "../../Components/Input";

const Container = styled.div``;

const Chat = styled.div`
  height: 80vh;
  overflow: scroll;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const InputCont = styled.div`
  padding: 0 20px;
`;

interface IProps {
  chatData: getChat;
  userData: userProfile;
  loading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  messageText: string;
}

const ChatPresenter: React.SFC<IProps> = ({
  chatData,
  loading,
  userData,
  onInputChange,
  onSubmit,
  messageText
}) => {
  const { GetChat } = chatData!;
  const { GetMyProfile } = userData!;

  return (
    <Container>
      <Header title={"Chat"} />
      {!loading && GetMyProfile && GetMyProfile.user && GetChat.chat && (
        <>
          <Chat>
            {GetChat.chat.messages &&
              GetChat.chat.messages.map(message => {
                if (message) {
                  return (
                    <Message
                      key={message.id}
                      text={message.text}
                      mine={GetMyProfile.user!.id === message.userId}
                    />
                  );
                }
                return null;
              })}
          </Chat>
          <InputCont>
            <Form submitFn={onSubmit}>
              <Input
                value={messageText}
                placeholder={"Type your Message"}
                onChange={onInputChange}
                name={"message"}
              />
            </Form>
          </InputCont>
        </>
      )}
    </Container>
  );
};

export default ChatPresenter;
