import React from "react";

import Header from "../../Components/Header";
import styled from "../../typed-components";
import { getChat, userProfile } from "../../types/api";

const Container = styled.div``;

interface IProps {
  chatData: getChat;
  userData: userProfile;
  loading: boolean;
}

const ChatPresenter: React.SFC<IProps> = ({ chatData, loading, userData }) => {
  const { GetChat } = chatData!;
  const { GetMyProfile } = userData!;

  return (
    <Container>
      <Header title={"Chat"} />
      {!loading && GetMyProfile.user && GetChat.chat && <></>}
    </Container>
  );
};

export default ChatPresenter;
