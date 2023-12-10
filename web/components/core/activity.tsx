import { useRouter } from "next/router";
import { observer } from "mobx-react-lite";
// mobx store
import { useMobxStore } from "lib/mobx/store-provider";
// hook
import useEstimateOption from "hooks/use-estimate-option";
// icons
import { Tooltip, BlockedIcon, BlockerIcon, RelatedIcon, LayersIcon, DiceIcon } from "@plane/ui";
import {
  TagIcon,
  CopyPlus,
  Calendar,
  Link2Icon,
  RocketIcon,
  Users2Icon,
  ArchiveIcon,
  PaperclipIcon,
  ContrastIcon,
  TriangleIcon,
  LayoutGridIcon,
  SignalMediumIcon,
  MessageSquareIcon,
  UsersIcon,
} from "lucide-react";
// helpers
import { renderShortDateWithYearFormat } from "helpers/date-time.helper";
import { capitalizeFirstLetter } from "helpers/string.helper";
// types
import { IIssueActivity } from "types";
import { useEffect } from "react";

const IssueLink = ({ activity }: { activity: IIssueActivity }) => {
  const router = useRouter();
  const { workspaceSlug } = router.query;

  return (
    <Tooltip tooltipContent={activity.issue_detail ? activity.issue_detail.name : "This issue has been deleted"}>
      <a
        aria-disabled={activity.issue === null}
        href={`${
          activity.issue_detail
            ? `/${workspaceSlug ?? activity.workspace_detail?.slug}/projects/${activity.project}/issues/${
                activity.issue
              }`
            : "#"
        }`}
        target={activity.issue === null ? "_self" : "_blank"}
        rel={activity.issue === null ? "" : "noopener noreferrer"}
        className="inline-flex items-center gap-1 font-medium text-custom-text-100 hover:underline"
      >
        {activity.issue_detail ? `${activity.project_detail.identifier}-${activity.issue_detail.sequence_id}` : "Issue"}
        <RocketIcon size={12} color="#6b7280" className="flex-shrink-0" />
      </a>
    </Tooltip>
  );
};

const UserLink = ({ activity }: { activity: IIssueActivity }) => {
  const router = useRouter();
  const { workspaceSlug } = router.query;

  return (
    <a
      href={`/${workspaceSlug ?? activity.workspace_detail?.slug}/profile/${
        activity.new_identifier ?? activity.old_identifier
      }`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center font-medium text-custom-text-100 hover:underline"
    >
      {activity.new_value && activity.new_value !== "" ? activity.new_value : activity.old_value}
    </a>
  );
};

const LabelPill = observer(({ labelId, workspaceSlug }: { labelId: string; workspaceSlug: string }) => {
  const {
    workspace: { labels, fetchWorkspaceLabels },
  } = useMobxStore();

  const workspaceLabels = labels[workspaceSlug];

  useEffect(() => {
    if (!workspaceLabels) fetchWorkspaceLabels(workspaceSlug);
  }, [fetchWorkspaceLabels, workspaceLabels, workspaceSlug]);

  return (
    <span
      className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
      style={{
        backgroundColor: workspaceLabels?.find((l) => l.id === labelId)?.color ?? "#000000",
      }}
      aria-hidden="true"
    />
  );
});

const EstimatePoint = ({ point }: { point: string }) => {
  const { estimateValue, isEstimateActive } = useEstimateOption(Number(point));
  const currentPoint = Number(point) + 1;

  return (
    <span className="font-medium text-custom-text-100">
      {isEstimateActive ? estimateValue : `${currentPoint} ${currentPoint > 1 ? "points" : "point"}`}
    </span>
  );
};

const activityDetails: {
  [key: string]: {
    message: (activity: IIssueActivity, showIssue: boolean, workspaceSlug: string) => React.ReactNode;
    icon: React.ReactNode;
  };
} = {
  assignees: {
    message: (activity, showIssue) => {
      if (activity.old_value === "")
        return (
          <>
            added a new assignee <UserLink activity={activity} />
            {showIssue && (
              <>
                {" "}
                to <IssueLink activity={activity} />
              </>
            )}
            .
          </>
        );
      else
        return (
          <>
            removed the assignee <UserLink activity={activity} />
            {showIssue && (
              <>
                {" "}
                from <IssueLink activity={activity} />
              </>
            )}
            .
          </>
        );
    },
    icon: <Users2Icon size={12} color="#6b7280" aria-hidden="true" />,
  },
  archived_at: {
    message: (activity) => {
      if (activity.new_value === "restore") return "restored the issue.";
      else return "archived the issue.";
    },
    icon: <ArchiveIcon size={12} color="#6b7280" aria-hidden="true" />,
  },
  attachment: {
    message: (activity, showIssue) => {
      if (activity.verb === "created")
        return (
          <>
            uploaded a new{" "}
            <a
              href={`${activity.new_value}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-custom-text-100 hover:underline"
            >
              attachment
              <RocketIcon size={12} color="#6b7280" />
            </a>
            {showIssue && (
              <>
                {" "}
                to <IssueLink activity={activity} />
              </>
            )}
          </>
        );
      else
        return (
          <>
            removed an attachment
            {showIssue && (
              <>
                {" "}
                from <IssueLink activity={activity} />
              </>
            )}
            .
          </>
        );
    },
    icon: <PaperclipIcon size={12} color="#6b7280" aria-hidden="true" />,
  },
  blocking: {
    message: (activity) => {
      if (activity.old_value === "")
        return (
          <>
            marked this issue is blocking issue{" "}
            <span className="font-medium text-custom-text-100">{activity.new_value}</span>.
          </>
        );
      else
        return (
          <>
            removed the blocking issue <span className="font-medium text-custom-text-100">{activity.old_value}</span>.
          </>
        );
    },
    icon: <BlockerIcon height="12" width="12" color="#6b7280" />,
  },
  blocked_by: {
    message: (activity) => {
      if (activity.old_value === "")
        return (
          <>
            marked this issue is being blocked by{" "}
            <span className="font-medium text-custom-text-100">{activity.new_value}</span>.
          </>
        );
      else
        return (
          <>
            removed this issue being blocked by issue{" "}
            <span className="font-medium text-custom-text-100">{activity.old_value}</span>.
          </>
        );
    },
    icon: <BlockedIcon height="12" width="12" color="#6b7280" />,
  },
  cycles: {
    message: (activity, showIssue, workspaceSlug) => {
      if (activity.verb === "created")
        return (
          <>
            <span className="flex-shrink-0">added this issue to the cycle </span>
            <a
              href={`/${workspaceSlug}/projects/${activity.project}/cycles/${activity.new_identifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 truncate font-medium text-custom-text-100 hover:underline"
            >
              <span className="truncate">{activity.new_value}</span>
              <RocketIcon size={12} color="#6b7280" className="flex-shrink-0" />
            </a>
          </>
        );
      else if (activity.verb === "updated")
        return (
          <>
            <span className="flex-shrink-0">set the cycle to </span>
            <a
              href={`/${workspaceSlug}/projects/${activity.project}/cycles/${activity.new_identifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 truncate font-medium text-custom-text-100 hover:underline"
            >
              <span className="truncate">{activity.new_value}</span>
              <RocketIcon size={12} color="#6b7280" className="flex-shrink-0" />
            </a>
          </>
        );
      else
        return (
          <>
            removed the issue from the cycle{" "}
            <a
              href={`/${workspaceSlug}/projects/${activity.project}/cycles/${activity.old_identifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 truncate font-medium text-custom-text-100 hover:underline"
            >
              <span className="truncate">{activity.old_value}</span>
              <RocketIcon size={12} color="#6b7280" className="flex-shrink-0" />
            </a>
          </>
        );
    },
    icon: <ContrastIcon size={12} color="#6b7280" aria-hidden="true" />,
  },
  duplicate: {
    message: (activity) => {
      if (activity.old_value === "")
        return (
          <>
            marked this issue as duplicate of{" "}
            <span className="font-medium text-custom-text-100">{activity.new_value}</span>.
          </>
        );
      else
        return (
          <>
            removed this issue as a duplicate of{" "}
            <span className="font-medium text-custom-text-100">{activity.old_value}</span>.
          </>
        );
    },
    icon: <CopyPlus size={12} color="#6b7280" />,
  },
  description: {
    message: (activity, showIssue) => (
      <>
        updated the description
        {showIssue && (
          <>
            {" "}
            of <IssueLink activity={activity} />
          </>
        )}
        .
      </>
    ),
    icon: <MessageSquareIcon size={12} color="#6b7280" aria-hidden="true" />,
  },
  estimate_point: {
    message: (activity, showIssue) => {
      if (!activity.new_value)
        return (
          <>
            removed the estimate point
            {showIssue && (
              <>
                {" "}
                from <IssueLink activity={activity} />
              </>
            )}
            .
          </>
        );
      else
        return (
          <>
            set the estimate point to <EstimatePoint point={activity.new_value} />
            {showIssue && (
              <>
                {" "}
                for <IssueLink activity={activity} />
              </>
            )}
            .
          </>
        );
    },
    icon: <TriangleIcon size={12} color="#6b7280" aria-hidden="true" />,
  },
  issue: {
    message: (activity) => {
      if (activity.verb === "created") return "created the issue.";
      else return "deleted an issue.";
    },
    icon: <LayersIcon width={12} height={12} color="#6b7280" aria-hidden="true" />,
  },
  labels: {
    message: (activity, showIssue, workspaceSlug) => {
      if (activity.old_value === "")
        return (
          <>
            added a new label{" "}
            <span className="inline-flex w-min items-center gap-2 truncate whitespace-nowrap rounded-full border border-custom-border-300 px-2 py-0.5 text-xs">
              <LabelPill labelId={activity.new_identifier ?? ""} workspaceSlug={workspaceSlug} />
              <span className="flex-shrink truncate font-medium text-custom-text-100">{activity.new_value}</span>
            </span>
            {showIssue && (
              <span>
                {" "}
                to <IssueLink activity={activity} />
              </span>
            )}
          </>
        );
      else
        return (
          <>
            removed the label{" "}
            <span className="inline-flex w-min items-center gap-2 truncate whitespace-nowrap rounded-full border border-custom-border-300 px-2 py-0.5 text-xs">
              <LabelPill labelId={activity.old_identifier ?? ""} workspaceSlug={workspaceSlug} />
              <span className="flex-shrink truncate font-medium text-custom-text-100">{activity.old_value}</span>
            </span>
            {showIssue && (
              <span>
                {" "}
                from <IssueLink activity={activity} />
              </span>
            )}
          </>
        );
    },
    icon: <TagIcon size={12} color="#6b7280" aria-hidden="true" />,
  },
  link: {
    message: (activity, showIssue) => {
      if (activity.verb === "created")
        return (
          <>
            added this{" "}
            <a
              href={`${activity.new_value}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-custom-text-100 hover:underline"
            >
              link
              <RocketIcon size={12} color="#6b7280" />
            </a>
            {showIssue && (
              <>
                {" "}
                to <IssueLink activity={activity} />
              </>
            )}
            .
          </>
        );
      else if (activity.verb === "updated")
        return (
          <>
            updated the{" "}
            <a
              href={`${activity.old_value}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-custom-text-100 hover:underline"
            >
              link
              <RocketIcon size={12} color="#6b7280" />
            </a>
            {showIssue && (
              <>
                {" "}
                from <IssueLink activity={activity} />
              </>
            )}
            .
          </>
        );
      else
        return (
          <>
            removed this{" "}
            <a
              href={`${activity.old_value}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-custom-text-100 hover:underline"
            >
              link
              <RocketIcon size={12} color="#6b7280" />
            </a>
            {showIssue && (
              <>
                {" "}
                from <IssueLink activity={activity} />
              </>
            )}
            .
          </>
        );
    },
    icon: <Link2Icon size={12} color="#6b7280" aria-hidden="true" />,
  },
  modules: {
    message: (activity, showIssue, workspaceSlug) => {
      if (activity.verb === "created")
        return (
          <>
            added this issue to the module{" "}
            <a
              href={`/${workspaceSlug}/projects/${activity.project}/modules/${activity.new_identifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 truncate font-medium text-custom-text-100 hover:underline"
            >
              <span className="truncate">{activity.new_value}</span>
              <RocketIcon size={12} color="#6b7280" className="flex-shrink-0" />
            </a>
          </>
        );
      else if (activity.verb === "updated")
        return (
          <>
            set the module to{" "}
            <a
              href={`/${workspaceSlug}/projects/${activity.project}/modules/${activity.new_identifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 truncate font-medium text-custom-text-100 hover:underline"
            >
              <span className="truncate">{activity.new_value}</span>
              <RocketIcon size={12} color="#6b7280" className="flex-shrink-0" />
            </a>
          </>
        );
      else
        return (
          <>
            removed the issue from the module{" "}
            <a
              href={`/${workspaceSlug}/projects/${activity.project}/modules/${activity.old_identifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 truncate font-medium text-custom-text-100 hover:underline"
            >
              <span className="truncate">{activity.old_value}</span>
              <RocketIcon size={12} color="#6b7280" className="flex-shrink-0" />
            </a>
          </>
        );
    },
    icon: <DiceIcon className="h-3 w-3 !text-[#6b7280]" aria-hidden="true" />,
  },
  name: {
    message: (activity, showIssue) => (
      <>
        <span className="truncate">set the name to {activity.new_value}</span>
        {showIssue && (
          <>
            {" "}
            of <IssueLink activity={activity} />
          </>
        )}
        .
      </>
    ),
    icon: <MessageSquareIcon size={12} color="#6b7280" aria-hidden="true" />,
  },
  parent: {
    message: (activity, showIssue) => {
      if (!activity.new_value)
        return (
          <>
            removed the parent <span className="font-medium text-custom-text-100">{activity.old_value}</span>
            {showIssue && (
              <>
                {" "}
                from <IssueLink activity={activity} />
              </>
            )}
            .
          </>
        );
      else
        return (
          <>
            set the parent to <span className="font-medium text-custom-text-100">{activity.new_value}</span>
            {showIssue && (
              <>
                {" "}
                for <IssueLink activity={activity} />
              </>
            )}
            .
          </>
        );
    },
    icon: <UsersIcon className="h-3 w-3 !text-[#6b7280]" aria-hidden="true" />,
  },
  priority: {
    message: (activity, showIssue) => (
      <>
        set the priority to{" "}
        <span className="font-medium text-custom-text-100">
          {activity.new_value ? capitalizeFirstLetter(activity.new_value) : "None"}
        </span>
        {showIssue && (
          <>
            {" "}
            for <IssueLink activity={activity} />
          </>
        )}
        .
      </>
    ),
    icon: <SignalMediumIcon size={12} color="#6b7280" aria-hidden="true" />,
  },
  relates_to: {
    message: (activity) => {
      if (activity.old_value === "")
        return (
          <>
            marked that this issue relates to{" "}
            <span className="font-medium text-custom-text-100">{activity.new_value}</span>.
          </>
        );
      else
        return (
          <>
            removed the relation from <span className="font-medium text-custom-text-100">{activity.old_value}</span>.
          </>
        );
    },
    icon: <RelatedIcon height="12" width="12" color="#6b7280" />,
  },
  start_date: {
    message: (activity, showIssue) => {
      if (!activity.new_value)
        return (
          <>
            removed the start date
            {showIssue && (
              <>
                {" "}
                from <IssueLink activity={activity} />
              </>
            )}
            .
          </>
        );
      else
        return (
          <>
            set the start date to{" "}
            <span className="font-medium text-custom-text-100">
              {renderShortDateWithYearFormat(activity.new_value)}
            </span>
            {showIssue && (
              <>
                {" "}
                for <IssueLink activity={activity} />
              </>
            )}
            .
          </>
        );
    },
    icon: <Calendar size={12} color="#6b7280" aria-hidden="true" />,
  },
  state: {
    message: (activity, showIssue) => (
      <>
        set the state to <span className="font-medium text-custom-text-100">{activity.new_value}</span>
        {showIssue && (
          <>
            {" "}
            for <IssueLink activity={activity} />
          </>
        )}
        .
      </>
    ),
    icon: <LayoutGridIcon size={12} color="#6b7280" aria-hidden="true" />,
  },
  target_date: {
    message: (activity, showIssue) => {
      if (!activity.new_value)
        return (
          <>
            removed the due date
            {showIssue && (
              <>
                {" "}
                from <IssueLink activity={activity} />
              </>
            )}
            .
          </>
        );
      else
        return (
          <>
            set the due date to{" "}
            <span className="font-medium text-custom-text-100">
              {renderShortDateWithYearFormat(activity.new_value)}
            </span>
            {showIssue && (
              <>
                {" "}
                for <IssueLink activity={activity} />
              </>
            )}
            .
          </>
        );
    },
    icon: <Calendar size={12} color="#6b7280" aria-hidden="true" />,
  },
};

export const ActivityIcon = ({ activity }: { activity: IIssueActivity }) => (
  <>{activityDetails[activity.field as keyof typeof activityDetails]?.icon}</>
);

type ActivityMessageProps = {
  activity: IIssueActivity;
  showIssue?: boolean;
};

export const ActivityMessage = ({ activity, showIssue = false }: ActivityMessageProps) => {
  const router = useRouter();
  const { workspaceSlug } = router.query;

  return (
    <>
      {activityDetails[activity.field as keyof typeof activityDetails]?.message(
        activity,
        showIssue,
        workspaceSlug ? workspaceSlug.toString() : activity.workspace_detail?.slug ?? ""
      )}
    </>
  );
};
