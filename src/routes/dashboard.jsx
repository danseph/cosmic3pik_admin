import Dashboard from "views/Dashboard/Dashboard";
import Basic from "views/Basic/Basic";
import Vote from "views/Vote/Vote";
import VoteWrite from "views/Vote/VoteWrite";
import Board from "views/Board/Board";
import BoardWrite from "views/Board/BoardWrite";
import UserProfile from "views/UserProfile/UserProfile";
import TableList from "views/TableList/TableList";
import Typography from "views/Typography/Typography";
import Icons from "views/Icons/Icons";
import Maps from "views/Maps/Maps";
import Notifications from "views/Notifications/Notifications";
import Upgrade from "views/Upgrade/Upgrade";
import Language from "views/Language/Language";
import Robot from "views/Robot/Robot";
import Withdraw from "views/Withdraw/Withdraw";
import WithdrawView from "views/Withdraw/WithdrawView";
import WithdrawWrite from "views/Withdraw/WithdrawWrite";
import WithdrawLog from "views/Withdraw/WithdrawLog";
import Member from "views/Member/Member";
import Version from "views/Version/Version";
import VersionWrite from "views/Version/VersionWrite";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "pe-7s-graph",
    view: true,
    component: Dashboard
  },
  {
    path: "/basic",
    name: "Basic",
    icon: "pe-7s-home",
    component: Basic,
    view: true,
  },
  {
    path: "/vote",
    name: "Vote",
    icon: "pe-7s-graph3",
    component: Vote,
    view: true,
  },
  {
    path: "/voteWrite",
    name: "VoteWrite",
    icon: "pe-7s-graph3",
    component: VoteWrite,
    view: false,
  },
  {
    path: "/language",
    name: "Language set",
    icon: "pe-7s-micro",
    component: Language,
    view: true

  },
  {
    path: "/board",
    name: "Board",
    icon: "pe-7s-chat",
    component: Board,
    view: true,
  },
  {
    path: "/boardWrite",
    name: "BoardWrite",
    icon: "pe-7s-chat",
    component: BoardWrite,
    view: false,
  },
  {
    path: "/robot",
    name: "Robot",
    icon: "pe-7s-like",
    component: Robot,
    view: true,
  },
  {
    path: "/withdraw",
    name: "Withdraw",
    icon: "pe-7s-wallet",
    component: Withdraw,
    view: true,
  },
  {
    path: "/member",
    name: "Member",
    icon: "pe-7s-user",
    component: Member,
    view: true,
  },
  {
    path: "/withdrawView",
    name: "Withdraw",
    icon: "pe-7s-wallet",
    component: WithdrawView,
    view: false,
  },
  {
    path: "/withdrawWrite",
    name: "Withdraw",
    icon: "pe-7s-wallet",
    component: WithdrawWrite,
    view: false,
  },
  {
    path: "/withdrawLog",
    name: "Withdraw",
    icon: "pe-7s-wallet",
    component: WithdrawLog,
    view: false,
  },
  {
    path: "/typography",
    name: "Typography",
    icon: "pe-7s-news-paper",
    component: Typography,
    view: false,
  },
  {
    path: "/version",
    name: "Version",
    icon: "pe-7s-server",
    component: Version,
    view: true,
  },
  {
    path: "/versionWrite",
    name: "VersionWrite",
    icon: "pe-7s-server",
    component: VersionWrite,
    view: false,
  },


  {
    path: "/icons",
    name: "Icons",
    icon: "pe-7s-science",
    component: Icons,
    view: true,
  },
  {
    path: "/user",
    name: "User Profile",
    icon: "pe-7s-user",
    component: UserProfile,
    view: false,
  },
  {
    path: "/table",
    name: "Table List",
    icon: "pe-7s-note2",
    component: TableList,
    view: false,
  },
  {
    path: "/maps",
    name: "Maps",
    icon: "pe-7s-map-marker",
    component: Maps,
    view: false,
  },
  {
    path: "/notifications",
    name: "Notifications",
    icon: "pe-7s-bell",
    component: Notifications,
    view: false,
  },
  {
    upgrade: true,
    path: "/upgrade",
    name: "Upgrade to PRO",
    icon: "pe-7s-rocket",
    component: Upgrade,
    view: false,
  },

  {
    redirect: true,
    path: "/",
    to: "/dashboard",
    name: "Dashboard",
    view: false,
  }
];

export default dashboardRoutes;
