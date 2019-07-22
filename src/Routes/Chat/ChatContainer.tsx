import React from "react";
import { RouteComponentProps } from "react-router";
import ChatPresenter from "./ChatPresenter";
import { Query } from "react-apollo";
import { getChat, getChatVariables, userProfile } from "../../types/api";
import { toast } from "react-toastify";
import { USER_PROFILE } from "../../sharedQueries";
import { GET_CHAT } from "./ChatQueries";

interface IProps extends RouteComponentProps<any> {}

class ChatQuery extends Query<getChat, getChatVariables> {}
class ProfileQuery extends Query<userProfile> {}

class ChatContainer extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);

    if (!props.match.params.chatId) {
      props.history.push("/");
    }
  }

  public render() {
    const {
      match: {
        params: { chatId }
      }
    } = this.props;

    const _chatId = Number(chatId);
    return (
      <ProfileQuery query={USER_PROFILE}>
        {({ data: userData }) => {
          if (userData) {
            return (
              <ChatQuery query={GET_CHAT} variables={{ chatId: _chatId }}>
                {({ data: chatData, loading }) => {
                  if (chatData) {
                    return (
                      <ChatPresenter
                        chatData={chatData}
                        userData={userData}
                        loading={loading}
                      />
                    );
                  } else {
                    return toast.error("no chat data");
                  }
                }}
              </ChatQuery>
            );
          } else {
            return toast.error("no userData in cache");
          }
        }}
      </ProfileQuery>
    );
  }
}

export default ChatContainer;
