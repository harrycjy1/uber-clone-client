import React from "react";
import { RouteComponentProps } from "react-router";
import ChatPresenter from "./ChatPresenter";
import { Query, Mutation, MutationFn } from "react-apollo";
import {
  getChat,
  getChatVariables,
  userProfile,
  sendMessageVariables,
  sendMessage
} from "../../types/api";
import { toast } from "react-toastify";
import { USER_PROFILE } from "../../sharedQueries";
import { GET_CHAT, SEND_MESSAGE, SUBSCRIBE_TO_MESSAGES } from "./ChatQueries";
import { SubscribeToMoreOptions } from "apollo-boost";

interface IProps extends RouteComponentProps<any> {}
interface IState {
  message: string;
}

class ChatQuery extends Query<getChat, getChatVariables> {}
class ProfileQuery extends Query<userProfile> {}
class SendMessageMutation extends Mutation<sendMessage, sendMessageVariables> {}

class ChatContainer extends React.Component<IProps, IState> {
  public sendMessageFn: MutationFn<sendMessage, sendMessageVariables>;

  constructor(props: IProps) {
    super(props);

    if (!props.match.params.chatId) {
      props.history.push("/");
    }
    this.state = {
      message: ""
    };
  }

  public render() {
    const {
      match: {
        params: { chatId }
      }
    } = this.props;

    const { message } = this.state;
    const _chatId = Number(chatId);
    return (
      <ProfileQuery query={USER_PROFILE}>
        {({ data: userData }) => {
          if (userData) {
            return (
              <ChatQuery query={GET_CHAT} variables={{ chatId: _chatId }}>
                {({ data: chatData, loading, subscribeToMore }) => {
                  if (chatData) {
                    const subscribeToMoreOption: SubscribeToMoreOptions = {
                      document: SUBSCRIBE_TO_MESSAGES,
                      updateQuery: (prev, { subscriptionData }) => {
                        if (!subscriptionData.data) {
                          return prev;
                        }

                        const {
                          data: { MessageSubscription }
                        } = subscriptionData;
                        const {
                          GetChat: {
                            chat: { messages }
                          }
                        } = prev;

                        const newMessageId = MessageSubscription!.id;
                        const latestMessageId = messages![messages.length - 1]!
                          .id;
                        //메시지 중복 피하기
                        if (newMessageId === latestMessageId) {
                          return;
                        }

                        const newObject = Object.assign({}, prev, {
                          GetChat: {
                            ...prev.GetChat,
                            chat: {
                              ...prev.GetChat.chat,
                              messages: [
                                ...prev.GetChat.chat.messages,
                                MessageSubscription
                              ]
                            }
                          }
                        });

                        return newObject;
                      }
                    };
                    subscribeToMore(subscribeToMoreOption);
                    return (
                      <SendMessageMutation mutation={SEND_MESSAGE}>
                        {sendMessageFn => {
                          this.sendMessageFn = sendMessageFn;
                          return (
                            <ChatPresenter
                              chatData={chatData}
                              userData={userData}
                              loading={loading}
                              onInputChange={this.onInputChange}
                              onSubmit={this.onSubmit}
                              messageText={message}
                            />
                          );
                        }}
                      </SendMessageMutation>
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

  public onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value }
    } = e;

    this.setState({
      [name]: value
    } as any);
  };

  public onSubmit = () => {
    const {
      match: {
        params: { chatId }
      }
    } = this.props;
    const { message } = this.state;
    const _chatId = Number(chatId);
    if (message !== "") {
      this.setState({
        message: ""
      });

      this.sendMessageFn({
        variables: { chatId: _chatId, text: message }
      });
      return;
    }
  };
}

export default ChatContainer;
