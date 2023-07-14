import {
  IonAccordion,
  IonAccordionGroup,
  IonButton,
  IonIcon,
  useIonRouter,
} from "@ionic/react";
import { Maybe } from "graphql/jsutils/Maybe";
import {
  chevronBack,
  chevronDown,
  create,
  createOutline,
} from "ionicons/icons";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { Post, Section, usePostReadLazyQuery } from "../../generated/graphql";
import PostCreate from "../post/PostCreate";
import VoteBox from "../voting/VoteBox";
import "./PostRead.css";
import {
  get_cardinal_suffix,
  get_datetime_string,
  useForceUpdate,
} from "../../common/utility";
import UserRead from "../user/UserRead";
import { globals } from "../../services/globals";
import { licenses } from "./licenses";
import PostCreate2 from "./PostCreate2";
import { Lexitor } from "./Lexitor";

type PostReadProps = {
  post: Post;
  max_vote_rank: Maybe<number>;
  candidates_count: number;
  nation_id: string;
  language_id: string;
};

const PostRead: React.FC<PropsWithChildren<PostReadProps>> = (props) => {
  const [show_create, set_show_create] = useState(false);
  const [active_post, set_active_post] = useState<Post>(props.post);

  const [getData, { loading: loading2, error: error2, data: data2 }] =
    usePostReadLazyQuery();

  const post_create_success = async () => {
    set_show_create(false);
    const res = await getData({
      variables: {
        postId: active_post.post_id,
      },
    });

    if (res.data?.postReadResolver.post) {
      set_active_post(res.data?.postReadResolver.post);
    }
  };

  return (
    <div className="post-read-wrap">
      {/* POST HEADER */}
      <div className="post-header">
        {active_post && (
          <div className="post-header-left">
            <span className="post-read-rank">
              <span className="rank">{active_post.rank}</span>
              <span className="rank-suffix">
                {get_cardinal_suffix(active_post.rank)}
              </span>
            </span>
            <span className="post-read-user-id">
              <UserRead user_id={active_post.created_by.i.toString()} />
            </span>

            {/* <span className="post-read-created-at">
              {get_datetime_string(active_post.created_at)}
            </span> */}
          </div>
        )}
      </div>

      {/* LEX VIEW */}
      {!show_create &&
        active_post &&
        active_post.parts[0]?.current_version.content &&
        active_post.parts[0]?.content_type == 'lexical-text' && (
          <div className="post-read-body">
            <div className="post-read-quill-wrap">
              {active_post.parts.map((part) => {
                if (part) {
                  return (
                      <Lexitor
                        key={part.current_version.version_id + "-lexitor"}
                        initial_state={part.current_version.content}
                        on_change={() => { }}
                        editable={false}
                      />
                  );
                }
              })}

              {/* LICENSE TEXT */}
              {/* <div className="post-read-license">
                {licenses.find((entry) => entry.id == active_post.license_id)
                  ?.url && (
                    <a
                      href={
                        licenses.find(
                          (entry) => entry.id == active_post.license_id
                        )!!.url!!
                      }
                      target="_blank"
                    >
                      {
                        licenses.find(
                          (entry) => entry.id == active_post.license_id
                        )?.title
                      }
                    </a>
                  )}
              </div> */}

              {/* <div className="post-read-created-at">
                Created {get_datetime_string(active_post.created_at)}
              </div> */}
            </div>

            {/* EDIT POST ICON */}
            {!show_create &&
              active_post.created_by.i == globals.get_user_id() && (
                <div className="post-read-show-create-wrap clickable">
                  <IonIcon
                    icon={createOutline}
                    className="clickable"
                    onClick={(e) => {
                      set_show_create(true);
                    }}
                  ></IonIcon>
                </div>
              )}
          </div>
        )
      }

      {/* HTML VIEW */}
      {/* {!show_create &&
        active_post &&
        active_post.parts[0]?.current_version.content &&
        active_post.parts[0]?.current_version.content_type == 0 && (
          <div className="post-read-html-wrap">
            <div
              dangerouslySetInnerHTML={{
                __html: active_post.parts[0]?.current_version.content,
              }}
            ></div>
            <div className="post-read-license">
              {licenses.find((entry) => entry.id == active_post.license_id)
                ?.url && (
                  <a
                    href={
                      licenses.find(
                        (entry) => entry.id == active_post.license_id
                      )!!.url!!
                    }
                    target="_blank"
                  >
                    {
                      licenses.find((entry) => entry.id == active_post.license_id)
                        ?.title
                    }
                  </a>
                )}
            </div>
            <div className="post-read-created-at">
              Created {get_datetime_string(active_post.created_at)}
            </div>
          </div>
        )
      } */}

      {/* CREATE NEW POST */}
      {show_create &&
        active_post.parent_election &&
        active_post.parts[0]?.current_version.content && (
          <div className="post-read-create-wrap">
            <PostCreate2
              key={
                active_post.parts[0]?.current_version.version_id +
                "-post-create"
              }
              parent_election={active_post.parent_election}
              create_success={post_create_success}
              default_value={active_post.parts[0]?.current_version.content}
              part_id={active_post.parts[0].part_id}
              post={active_post}
            ></PostCreate2>
            <IonButton
              type="button"
              color="danger"
              fill="clear"
              onClick={(e) => set_show_create(false)}
            >
              Cancel
            </IonButton>
          </div>
        )
      }

    </div>
  );
};

export default PostRead;
