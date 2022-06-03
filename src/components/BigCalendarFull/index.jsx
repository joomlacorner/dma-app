/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import moment from 'moment';
import {
  CONTENT_FIELD_KEY,
  ESI_CONTENT_API_RESPONSE_FIELD_KEY,
} from '../../constants/ContentModule';
import ContentUtils from '../../containers/ContentPage/ContentUtils/ContentUtils';
import './index.scss';
import FilterCalendar from '../FilterCalendar';
import CustomToolbar from './CustomToolbar';
import UpcomingPosts from '../UpcomingPosts';
import { CSSTransition } from 'react-transition-group';
import history from '../../routes/history';

const localizer = momentLocalizer(moment);

class BigCalendarFull extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      textBtnGroup: 'Month',
      textDayGroup: 'Today',
      isFilterCalendar: false,
    };
  }

  eventPropGetter = (event) => {
    return {
      style: { backgroundColor: event.background },
    };
  };

  handleNavigate = (date, time) => {
    const frist_day = moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('YYYY-MM-DD');
    const last_day = moment(new Date(date.getFullYear(), date.getMonth() + 1, 0)).format(
      'YYYY-MM-DD'
    );
    this.props.onFilter(
      {
        [CONTENT_FIELD_KEY.START_DATE]: frist_day,
        [CONTENT_FIELD_KEY.END_DATE]: last_day,
      },
      0,
      0
    );
  };

  Event = ({ event }) => {
    let divClass = 'wrapper_des_event d-inline-block w-100 shadow label-rounded ';
    let spanClass = 'fw-bold text-wrap opacity-75 ';
    const channelName = event.channel.length > 0 ? event?.channel[0]?.alias : 'facebook';
    divClass += channelName + '_calendar_background ';
    spanClass += channelName + '_calendar_text';

    // const popover = (
    //   <Popover id="popover-basic" className="bg-white z-index-100 rounded-2">
    //     <Popover.Title className="bg-blue-3 py-2 px-3 rounded-top d-flex justify-content-between align-items-center">
    //       <span className={spanClass}>{event.title}</span>
    //     </Popover.Title>
    //     {/*<Popover.Content className="py-2 px-3">*/}
    //     {/*  <p className="mb-0 mb-3">{event.text}</p>*/}
    //     {/*  /!* <div>*/}
    //     {/*    <a href={void 0} className="btn btn-success w-100">*/}
    //     {/*      <i>*/}
    //     {/*        <FontAwesomeIcon icon={faPlus} />*/}
    //     {/*      </i>*/}
    //     {/*      <span className="ms-2">Make a plan</span>*/}
    //     {/*    </a>*/}
    //     {/*  </div> *!/*/}
    //     {/*</Popover.Content>*/}
    //   </Popover>
    // );
    const navigateEditPost = () => {
      history.push(`content-edit/${event.id}`);
    };
    return (
      //trigger="click" placement="right" rootClose={true} overlay={popover}
      <div onClick={event.type === 'planing' ? '' : navigateEditPost}>
        <div className={divClass}>
          <span style={{ cursor: 'pointer' }} className="w-100 text-decoration-none d-inline-block">
            <span className={spanClass}>{event.title}</span>
          </span>
        </div>
      </div>
    );
  };

  handleFilterCalendar = () => {
    this.setState({
      isFilterCalendar: true,
    });
  };

  handleCloseFilterCalendar = () => {
    this.setState({
      isFilterCalendar: false,
    });
  };

  render() {
    let events = this.props?.events
      ? this.props?.events.map((content, index) => {
          const date = moment(content[CONTENT_FIELD_KEY.DATE], 'DD/MM/YYYY HH:mm');
          const ampm = date.toDate().getHours() >= 12 ? 'PM' : 'AM';
          return {
            id: content[CONTENT_FIELD_KEY.ID],
            title: date.toDate().getHours() + ' ' + ampm + ' | ' + content[CONTENT_FIELD_KEY.NAME],
            allDay: false,
            start: date.toDate(),
            end: date.toDate(),
            CHANNEL_TYPE: 'channel_type',
            channel: ContentUtils.getPageDetail(
              content[CONTENT_FIELD_KEY.CHANNELS],
              this.props?.listViewModel?.channelMasterData
            ),
          };
        })
      : [];
    events = events.concat(this.props.listViewModel.plaining);

    return (
      <div className="wr_calendar h-100 ">
        <div className="wr_calendar--left">
          <Calendar
            popup
            localizer={localizer}
            events={events}
            defaultDate={this.props.showDate}
            defaultView={this.props.showView}
            showMultiDayTimes
            components={{
              toolbar: CustomToolbar(this.handleFilterCalendar),
              event: this.Event,
            }}
            eventPropGetter={this.eventPropGetter}
            onNavigate={this.handleNavigate}
          />
        </div>
        <CSSTransition in={this.state.isFilterCalendar} timeout={300} classNames="filter_calendar">
          <FilterCalendar
            show={this.state.isFilterCalendar}
            handleCloseFilterCalendar={this.handleCloseFilterCalendar}
            {...this.props}
          />
        </CSSTransition>
      </div>
    );
  }
}

export default BigCalendarFull;
