import React from "react";
// swr
import useSWR from "swr";
// components
import { IssueKanBanViewRoot } from "components/issue-layouts/kanban";
// mobx store
import { useMobxStore } from "lib/mobx/store-provider";
import { RootStore } from "store/root";

const KanBanViewRoot = () => {
  const workspaceSlug: string = "plane-demo";
  const projectSlug: string = "08d59d96-9dfb-40e5-aa30-ecc66319450f";
  const moduleSlug: string = "05613afc-29ea-4fd8-a025-a3cdfed209d1";
  const cycleSlug: string = "1f66a767-00d1-422c-8f8f-6925282b7249";
  const viewSlug: string = "1f66a767-00d1-422c-8f8f-6925282b7249";

  const store: RootStore = useMobxStore();
  const { issueView: issueViewStore } = store;

  React.useEffect(() => {
    const init = async () => {
      // my issues under a workspace
      console.log("started--->");
      // await issueViewStore.getMyIssuesAsync(workspaceSlug, "my_issues", "list");
      // await issueViewStore.getMyIssuesAsync(workspaceSlug, "my_issues", "kanban");
      // await issueViewStore.getMyIssuesAsync(workspaceSlug, "my_issues", "calendar");
      // await issueViewStore.getMyIssuesAsync(workspaceSlug, "my_issues", "spreadsheet");
      // await issueViewStore.getMyIssuesAsync(workspaceSlug, "my_issues", "gantt");

      // project issues under and workspace and project
      // await issueViewStore.getProjectIssuesAsync(workspaceSlug, projectSlug, "issues", "list");
      await issueViewStore.getProjectIssuesAsync(workspaceSlug, projectSlug, "issues", "kanban");
      // await issueViewStore.getProjectIssuesAsync(workspaceSlug, projectSlug, "issues", "calendar");
      // await issueViewStore.getProjectIssuesAsync(
      //   workspaceSlug,
      //   projectSlug,
      //   "issues",
      //   "spreadsheet"
      // );
      // await issueViewStore.getProjectIssuesAsync(workspaceSlug, projectSlug, "issues", "gantt");

      // module issues under and workspace and project
      // await issueViewStore.getIssuesForModulesAsync(
      //   workspaceSlug,
      //   projectSlug,
      //   moduleSlug,
      //   "modules",
      //   "list"
      // );
      // await issueViewStore.getIssuesForModulesAsync(
      //   workspaceSlug,
      //   projectSlug,
      //   moduleSlug,
      //   "modules",
      //   "kanban"
      // );
      // await issueViewStore.getIssuesForModulesAsync(
      //   workspaceSlug,
      //   projectSlug,
      //   moduleSlug,
      //   "modules",
      //   "calendar"
      // );
      // await issueViewStore.getIssuesForModulesAsync(
      //   workspaceSlug,
      //   projectSlug,
      //   moduleSlug,
      //   "modules",
      //   "spreadsheet"
      // );
      // await issueViewStore.getIssuesForModulesAsync(
      //   workspaceSlug,
      //   projectSlug,
      //   moduleSlug,
      //   "modules",
      //   "gantt"
      // );

      // cycle issues under and workspace and project
      // await issueViewStore.getIssuesForCyclesAsync(
      //   workspaceSlug,
      //   projectSlug,
      //   cycleSlug,
      //   "cycles",
      //   "list"
      // );
      // await issueViewStore.getIssuesForCyclesAsync(
      //   workspaceSlug,
      //   projectSlug,
      //   cycleSlug,
      //   "cycles",
      //   "kanban"
      // );
      // await issueViewStore.getIssuesForCyclesAsync(
      //   workspaceSlug,
      //   projectSlug,
      //   cycleSlug,
      //   "cycles",
      //   "calendar"
      // );
      // await issueViewStore.getIssuesForCyclesAsync(
      //   workspaceSlug,
      //   projectSlug,
      //   cycleSlug,
      //   "cycles",
      //   "spreadsheet"
      // );
      // await issueViewStore.getIssuesForCyclesAsync(
      //   workspaceSlug,
      //   projectSlug,
      //   cycleSlug,
      //   "cycles",
      //   "gantt"
      // );

      // cycle issues under and workspace and project
      // await issueViewStore.getIssuesForViewsAsync(
      //   workspaceSlug,
      //   projectSlug,
      //   viewSlug,
      //   "views",
      //   "list"
      // );
      // await issueViewStore.getIssuesForViewsAsync(
      //   workspaceSlug,
      //   projectSlug,
      //   viewSlug,
      //   "views",
      //   "kanban"
      // );
      // await issueViewStore.getIssuesForViewsAsync(
      //   workspaceSlug,
      //   projectSlug,
      //   viewSlug,
      //   "views",
      //   "calendar"
      // );
      // await issueViewStore.getIssuesForViewsAsync(
      //   workspaceSlug,
      //   projectSlug,
      //   viewSlug,
      //   "views",
      //   "spreadsheet"
      // );
      // await issueViewStore.getIssuesForViewsAsync(
      //   workspaceSlug,
      //   projectSlug,
      //   viewSlug,
      //   "views",
      //   "gantt"
      // );

      console.log("ended--->");
    };

    init();
  }, []);

  return (
    <div className="w-screen min-h-[600px] h-screen">
      <div className="w-full h-full relative flex flex-col overflow-hidden">
        <div
          className="flex-shrink-0 h-[60px] border-b border-gray-200"
          // style={{ writingMode: "vertical-lr" }}
        >
          Filter Header
        </div>
        <div className="w-full h-full relative overflow-hidden">
          <IssueKanBanViewRoot />
        </div>
      </div>
    </div>
  );
};

export default KanBanViewRoot;