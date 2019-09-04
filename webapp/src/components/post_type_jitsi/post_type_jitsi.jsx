import React from 'react';

import {Svgs} from '../../constants';
import {formatDate} from '../../utils/date_utils';

import PropTypes from 'prop-types';
import {makeStyleFromTheme} from 'mattermost-redux/utils/theme_utils';

export default class PostTypeJitsi extends React.PureComponent {
    static propTypes = {

        /*
         * The post to render the message for.
         */
        post: PropTypes.object.isRequired,

        /**
         * Set to render post body compactly.
         */
        compactDisplay: PropTypes.bool,

        /**
         * Flags if the post_message_view is for the RHS (Reply).
         */
        isRHS: PropTypes.bool,

        /**
         * Set to display times using 24 hours.
         */
        useMilitaryTime: PropTypes.bool,

        /*
         * Logged in user's theme.
         */
        theme: PropTypes.object.isRequired,

        /*
         * Creator's name.
         */
        creatorName: PropTypes.string.isRequired
    };

    static defaultProps = {
        mentionKeys: [],
        compactDisplay: false,
        isRHS: false
    };

    constructor(props) {
        super(props);

        this.state = {
        };
    }

    handleClick(url) {
        //TODO: make it not this way, this is fucking stupid

        if (document.getElementById('voicechat-window')) {
            document.getElementById('voicechat-window').parentNode.removeChild(document.getElementById('voicechat-window'));
        }
        var newEl = document.createElement('div');
        newEl.id = 'voicechat-window';
        newEl.style.position = 'relative';
        newEl.style.height = "100%"; //thanks CSS for your infinite stupidity
        newEl.style.width = '100%';

        //if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1){
        //    newEl.style.height = (window.innerHeight / 2) - 100
        //}

        newEl.innerHTML = "<iframe class='vcnotloaded' id='iframevc' src='" + url + "' frameborder='0' allowfullscreen allow='geolocation; microphone; camera' style='overflow:hidden;height:100%;width:100%' height='100%' width='100%' >";
        document.getElementById('channel-header').parentNode.insertBefore(newEl, document.getElementById('post-list'));
        document.getElementById('iframevc').addEventListener('load', () => {
            if (document.getElementById('iframevc').className == 'vcnotloaded') {
                document.getElementById('iframevc').className = 'vcloaded';
            } else {
                document.getElementById('voicechat-window').parentNode.removeChild(document.getElementById('voicechat-window'));
            }
        }, false);
    }

    render() {
        const style = getStyle(this.props.theme);
        const post = this.props.post;
        const props = post.props || {};

        let preText;
        let content;
        let subtitle;
        let jsonclick;
        if (props.meeting_status === 'STARTED') {
            preText = `${this.props.creatorName} has started a call`;
            content = (
                <a
                    className='btn btn-lg btn-primary'
                    style={style.button}
                    onClick={() => this.handleClick(props.meeting_link)}
                    href='#'
                >
                    <i
                        style={style.buttonIcon}
                        dangerouslySetInnerHTML={{__html: Svgs.VIDEO_CAMERA_3}}
                    />
                    {'JOIN CALL'}
                </a>
            );

            if (props.meeting_personal) {
                subtitle = (
                    <span>
                        {'Creator: '}
                        {props.creatorName}
                    </span>
                );
            } else {
                subtitle = (
                    <span>
                        {'Creator: '}
                        {props.creatorName}
                    </span>
                );
            }
        } else if (props.meeting_status === 'ENDED') {
            preText = `${this.props.creatorName} has ended the meeting`;

            if (props.meeting_personal) {
                subtitle = 'Creator: ' + props.creatorName;
            } else {
                subtitle = 'Creator: ' + props.creatorName;
            }

            const startDate = new Date(post.create_at);
            const start = formatDate(startDate);
            const length = Math.ceil((new Date(post.update_at) - startDate) / 1000 / 60);

            content = (
                <div>
                    <h2 style={style.summary}>
                        {'Call Summary'}
                    </h2>
                    <span style={style.summaryItem}>{'Date: ' + start}</span>
                    <br/>
                    <span style={style.summaryItem}>{'Call Length: ' + length + ' minute(s)'}</span>
                </div>
            );
        }

        let title = 'Voice/Video Call';
        if (props.meeting_topic) {
            title = props.meeting_topic;
        }

        return (
            <div>
                {preText}
                <div style={style.attachment}>
                    <div style={style.content}>
                        <div style={style.container}>
                            <h1 style={style.title}>
                                {title}
                            </h1>
                            {subtitle}
                            <div>
                                <div style={style.body}>
                                    {content}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const getStyle = makeStyleFromTheme((theme) => {
    return {
        attachment: {
            marginLeft: '-20px',
            position: 'relative'
        },
        content: {
            borderRadius: '4px',
            borderStyle: 'solid',
            borderWidth: '1px',
            borderColor: '#BDBDBF',
            margin: '5px 0 5px 20px',
            padding: '2px 5px'
        },
        container: {
            borderLeftStyle: 'solid',
            borderLeftWidth: '4px',
            padding: '10px',
            borderLeftColor: '#89AECB'
        },
        body: {
            overflowX: 'auto',
            overflowY: 'hidden',
            paddingRight: '5px',
            width: '100%'
        },
        title: {
            fontSize: '16px',
            fontWeight: '600',
            height: '22px',
            lineHeight: '18px',
            margin: '5px 0 1px 0',
            padding: '0'
        },
        button: {
            fontFamily: 'Open Sans',
            fontSize: '12px',
            fontWeight: 'bold',
            letterSpacing: '1px',
            lineHeight: '19px',
            marginTop: '12px',
            borderRadius: '4px',
            color: theme.buttonColor
        },
        buttonIcon: {
            paddingRight: '8px',
            fill: theme.buttonColor
        },
        summary: {
            fontFamily: 'Open Sans',
            fontSize: '14px',
            fontWeight: '600',
            lineHeight: '26px',
            margin: '0',
            padding: '14px 0 0 0'
        },
        summaryItem: {
            fontFamily: 'Open Sans',
            fontSize: '14px',
            lineHeight: '26px'
        }
    };
});
