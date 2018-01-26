/*
    author: Alexander Zolotov
*/
import React from 'react';

import MyTasks from './MyTasks'

import Organizer from '~/src/theme/components/tasks/Organizer'

import ActionLink from '~/src/components/common/ActionLink'

import "~/src/theme/css/myTasksContainerNew.css"

/*Helper functions*/
const DayFromNumber = (dayNum)=> {
  const DayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return DayNames[dayNum];
}

const MonthFromNumber = (monthNum)=> {
  const MonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Dec'];

  return MonthNames[monthNum];
}

const GetHangoutPartner = (hangout, props) => {
  let Partner = hangout.metaData.participants.find(function(participant) {
    return participant.user._id != props.currentUserID;
  });

  return Partner;
}

const GetFirstPendingParticipant = (hangout, props) => {
  const FirstPendingParticipant = hangout.metaData.participants.find(function(participant){
    return participant.status == "pending";
  });

  return FirstPendingParticipant;
}

const FirstAcceptedParticipants = (hangout, props) => {
  const FirstAcceptedParticipant = hangout.metaData.participants.find(function(participant){
    return participant.user._id != props.currentUserID && participant.status == "accepted";
  });

  return FirstAcceptedParticipant;
}

const GetCurrentUserAsParticipant = (hangout, props) => {
  return hangout.metaData.participants.find(function(participant){
    return participant.user._id == props.currentUserID;
  });
}

const Hours12 = (date) => { return (date.getHours() + 24) % 12 || 12; }

const GenerateDateString = (time, props) => {
  const DateFromTime = new Date(time);
  
  const Noon = new Date(DateFromTime.getFullYear(), 
                        DateFromTime.getMonth(),
                        DateFromTime.getDate()
                        , 12, 0, 0);

  const AmPm = (DateFromTime.getTime() < Noon.getTime()) ? 'am' : 'pm';

  const Hours = String(Hours12(DateFromTime)) + AmPm;

  const DateString = props.timeNow >= time ? ` today at ${Hours}` 
         : `${DateFromTime.getDate()} ${MonthFromNumber(DateFromTime.getMonth())} at ${Hours}`;

  return DateString;
}

const CategorySelection = (props) => {
  return (
    <span className="dropdown">
      <span className="glyphicon glyphicon-menu-down dropdown-toggle" type="button" data-toggle="dropdown"></span>
        <ul className="dropdown-menu">
          {
            props.filters.map((filter, i) => {
            const ClassName = props.filterCurrent.type == filter.type ? "tasks-category-entry" : "tasks-category-entry active"
            return (
              <li key={i} className={props.filterCurrent.type == filter.type ? "active" : ""}>
                <ActionLink href="#" className={ClassName} onClick={()=>props.onFilterChange(filter)}>{filter.label}</ActionLink>
              </li>
            )
          })
        }
      </ul>
    </span>
  );
}

const RenderActions = (hangout, props) => {
  const Partner = GetHangoutPartner(hangout, props);
  const FirstPendingParticipant = GetFirstPendingParticipant(hangout, props);
  const FirstAcceptedParticipant = FirstAcceptedParticipants(hangout, props);

  switch (hangout.status) {
    case "complete": {
      return (
        <div className="task-actions-container">
        </div>
      );
    }
    case "finished": {
      if (hangout.metaData.ratings.findIndex(function(rating) {
        return rating.fromUser == props.currentUserID && rating.toUser == Partner.user._id; }) == -1) {
          return (
            <div className="task-actions-container">
              <button type="button" className="btn btn-sm btn-outline-inverse hangout-action-button-rate" 
                onClick={()=>props.onHangoutRate(hangout, Partner.user._id, "good")}>Good</button>
              <button type="button" className="btn btn-sm btn-outline-inverse hangout-action-button-rate"
                onClick={()=>props.onHangoutRate(hangout, Partner.user._id, "bad")}>Bad</button>
            </div>);
      }
      else {
        return (
          <div className="task-actions-container">
            <span>Waiting partner's feedback</span>
          </div>);
      }
    }
    case "None": {
      if (hangout.creator._id == props.currentUserID) {
        const TimeHasCome = props.timeNow >= hangout.metaData.time;

        if (FirstAcceptedParticipant) {
          return (
            <div className="task-actions-container">
              <button type="button" className="btn btn-sm btn-outline-inverse hangout-action-button-default" 
                onClick={()=>props.onHangoutActionPerform("reschedule", hangout)}>Reschedule
              </button>
              <button type="button" className="btn btn-sm btn-outline-inverse hangout-action-button-default" 
                onClick={()=>props.onHangoutActionPerform("cancel", hangout)}>Cancel
              </button>
              {
                <button type="button" className="btn btn-sm btn-outline-inverse hangout-action-button-default" 
                  disabled={!TimeHasCome}
                    onClick={()=>props.onHangoutActionPerform("start", hangout)}>Start
                </button>
              }
            </div>
          );
        }
        else if (FirstPendingParticipant) {
          return (
            <div className="task-actions-container">
              <button type="button" className="btn btn-sm btn-outline-inverse hangout-action-button-owner" 
                onClick={()=>props.onHangoutRequestAccept(hangout, FirstPendingParticipant.user)}>Accept
              </button>
              <button type="button" className="btn btn-sm btn-outline-inverse hangout-action-button-owner" 
                onClick={()=>{}}>Open Chat
              </button>
              <button type="button" className="btn btn-sm btn-outline-inverse hangout-action-button-owner"
                onClick={()=>props.onHangoutRequestAccept(hangout, FirstPendingParticipant.user)}>Reject
              </button>
            </div>
          );
        }
        else {
          return (
            <div className="task-actions-container">
              <button type="button" className="btn btn-sm btn-outline-inverse hangout-action-button-default" 
                onClick={()=>props.onHangoutActionPerform("reschedule", hangout)}>Reschedule
              </button>
              <button type="button" className="btn btn-sm btn-outline-inverse hangout-action-button-default" 
                onClick={()=>props.onHangoutActionPerform("cancel", hangout)}>Cancel
              </button>
            </div>
          );
        }
    }
    else {
      return (
        <div className="task-actions-container">
          <button type="button" className="btn btn-sm btn-outline-inverse hangout-action-button-withdraw" 
            onClick={()=>props.onHangoutActionPerform("leave", hangout)}>Withdraw</button>
        </div>
      );
    }
  }
  case "started": {
    return (
      <div className="task-actions-container">
        <button type="button" className="btn btn-sm btn-outline-inverse hangout-action-button-default" 
          onClick={()=>props.onHangoutActionPerform("reschedule", hangout)}>Reschedule
        </button>
        <button type="button" className="btn btn-sm btn-outline-inverse hangout-action-button-default" 
          onClick={()=>props.onHangoutActionPerform("cancel", hangout)}>Cancel
        </button>
        <button type="button" className="btn btn-sm btn-outline-inverse hangout-action-button-default" 
            disabled={!FirstAcceptedParticipant || props.timeNow < hangout.metaData.time}
              onClick={()=>props.onHangoutActionPerform("answer_questions", hangout)}>Answer Questions
        </button>
      </div>
    );
  }
  case "cancelled":
  case "canceled": {
    if (hangout.creator._id != props.currentUserID) {
      return (
        <div className="task-actions-container">
          <button type="button" className="btn btn-sm btn-outline-inverse hangout-action-button-withdraw" 
            onClick={()=>props.onHangoutActionPerform("leave", hangout)}>Withdraw</button>
        </div>
      );
    }
    else {
      return (
        <div className="task-actions-container">
        </div>
      );
    }
  }
  default: {
    return (
      <div className="task-actions-container">
      </div>
    );
  }
 }
}

const HangoutTitleFromStatus = (task, Partner) => {
  let result = <div id="title"></div>;

  if (!Partner) {
    switch (task.status) {
      case "canceled":
      case "cancelled": {
        result = (
          <div id="title">
            Your Deepdive has been cancelled
          </div>
          );
        break;
      }
      case "started": {
        result = (
          <div id="title">
            Your Deepdive is in progress
          </div>
          );
        break;
      }
      case "finished": {
        result = (
          <div id="title">
            Your Deepdive is finished
          </div>
          );
        break;
      }
      case "complete": {
        result = (
          <div id="title">
            Your Deepdive is complete
          </div>
          );
        break;
      }
      default: {
          result = (
            <div id="title">
                Your Deepdive has no any mets yet
            </div>
            );
          break;
      }
    } 
  }
  else {
    switch (task.status) {
      case "canceled":
      case "cancelled": {
        result = (
          <div id="title">
              Deepdive with <span id="partner-name">
              {` ${Partner.user.firstName}`}
            </span> has been cancelled
          </div>
          );
        break;
      }
      case "started": {
        result = (
          <div id="title">
              Deepdive with <span id="partner-name">
              {`${Partner.user.firstName}`}
            </span> is in progress
          </div>
          );
        break;
      }
      case "finished": {
        result = (
          <div id="title">
              Deepdive with <span id="partner-name">
              {`${Partner.user.firstName}`} </span> is finished
          </div>
          );
        break;
      }
      case "complete": {
        result = (
          <div id="title">
              Deepdive with <span id="partner-name">
              {`${Partner.user.firstName}`} </span> is complete
          </div>
          );
        break;
      }
      default: {
        if (Partner.status == "accepted") {
          result = (
            <div id="title">
                Confirmed Deepdive with <span id="partner-name">
                {`${Partner.user.firstName}`}
              </span>
            </div>
            );
        }
        else if (Partner.status == "pending") {
          result = (
            <div id="title">
              <span id="partner-name">
                {`${Partner.user.firstName}`}
              </span> {`wants to join your "${task.metaData.subject.skill.name}" Deepdive`}
            </div>
            );
        }
        break;
      }
    }
  }

  return result;
}

const RenderTaskTitle = (task, props) => {
  let result = <div id="title"></div>;

  if (task.type == "hangout") {
    const Partner = GetHangoutPartner(task, props);

    //Current user has created this hangout
    if (task.creator._id == props.currentUserID) {
      result = HangoutTitleFromStatus(task, Partner);
    }
    else {
      const CurrentUserAsParticipant = GetCurrentUserAsParticipant(task, props);

      //Why is this possible???
      if (!CurrentUserAsParticipant) {
        console.log("%c!CurrentUserAsParticipant", "color:red;background:green;");
        result = <div id="title"></div>;
      }
      else {
        //for Sent Requests
        switch (CurrentUserAsParticipant.status) {
          case "pending": {
            result = (
              <div id="title">
                Your request to Deepdive with
                <span id="partner-name">
                  {` ${Partner.user.firstName}`}
                </span> is pending approval
              </div>
            );
            break;
          }
          case "rejected": {
            result = (
              <div id="title">
                <span id="partner-name">
                  {`${Partner.user.firstName} `}
                </span>
                has not confirmed your request to join theirs Deepdive
              </div>
            );
            break;
          }
          default: {
            //request 'accepted'
            result = HangoutTitleFromStatus(task, Partner);
            break;
          }
        }
      }
    }
  }
  else {
    result = <div id="title">{task.name}</div>;
  }

  return result;
}

const RenderTask = (task, i, props) => {
  const DebugOutputClick = (task) => {
    console.log("Clicked task: "); 
    console.dir(task);
  };

  const TaskColClass = props.isCollapsed ? "col-lg-12" : "col-lg-4";

  if (task.type == "hangout") {
    const SecondLine = `Skill: ${task.metaData.subject.skill.name}`;
    const ThirdLine = `Time: ${GenerateDateString(task.status == "None" ? task.metaData.time : task.timeStatusChanged, props)}`

    return (
      <div className={TaskColClass} key={i}>
        <div className="my-tasks-task">
          <div className="my-tasks-task-text">
            {RenderTaskTitle(task, props)}
            <div id="description" onClick={()=>DebugOutputClick(task)}>{SecondLine}</div>
            <div id="description_1">{ThirdLine}</div>
          </div>
          {RenderActions(task, props)}
        </div>
      </div>
    )
  }

  return (
    <div className={TaskColClass} key={i}>
        <div className="my-tasks-task">
          {RenderTaskTitle(task, props)}
          <div id="description" onClick={()=>DebugOutputClick(task)}>{task.description}</div>
        </div>
      </div>
  )
}

const RenderTasks = (props) => {
  console.log("RenderTasks");
  console.dir(props.tasks);
  return (
    <div className="row">
      <div className="my-tasks-container-new-tasks-list">
        {
          props.tasks.map((task, i) => {
           return RenderTask(task, i, props)
          })
        }
      </div>
    </div>
  );
}

const MyTasksContainerNew = (props) => {
return(
    <div id="tasks-management-my-tasks" className="my-tasks-container-new">
    {props.isCollapsed &&
      <ActionLink id="user-tasks-expand" href="#" onClick={()=> props.onSetTreeScannerExpanded(false)}>
            <span className="glyphicon glyphicon-menu-right"></span>
      </ActionLink>
    }
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12">
            <div className="page-title">
              <span className="content-2-columns-left-title">Deepdive</span>
              {CategorySelection(props)}
            </div>
          </div>
        </div>
        {RenderTasks(props)}
      </div>
    </div>);
}

export default MyTasksContainerNew;