use derive_empty_traits::EmptyTraits;
use resolver_api::derive::Request;
use serde::{Deserialize, Serialize};
use typeshare::typeshare;

use crate::entities::{
  stack::{
    Stack, StackActionState, StackListItem, StackQuery, StackService,
  },
  update::Log,
  SearchCombinator, U64,
};

use super::MonitorReadRequest;

//

/// Get a specific stack. Response: [Stack].
#[typeshare]
#[derive(
  Serialize, Deserialize, Debug, Clone, Request, EmptyTraits,
)]
#[empty_traits(MonitorReadRequest)]
#[response(GetStackResponse)]
pub struct GetStack {
  /// Id or name
  #[serde(alias = "id", alias = "name")]
  pub stack: String,
}

#[typeshare]
pub type GetStackResponse = Stack;

//

/// Lists a specific stacks services (the containers). Response: [ListStackServicesResponse].
#[typeshare]
#[derive(
  Serialize, Deserialize, Debug, Clone, Request, EmptyTraits,
)]
#[empty_traits(MonitorReadRequest)]
#[response(ListStackServicesResponse)]
pub struct ListStackServices {
  /// Id or name
  #[serde(alias = "id", alias = "name")]
  pub stack: String,
}

#[typeshare]
pub type ListStackServicesResponse = Vec<StackService>;

//

/// Get a stack service's log. Response: [GetStackContainersResponse].
#[typeshare]
#[derive(
  Serialize, Deserialize, Debug, Clone, Request, EmptyTraits,
)]
#[empty_traits(MonitorReadRequest)]
#[response(GetStackServiceLogResponse)]
pub struct GetStackServiceLog {
  /// Id or name
  #[serde(alias = "id", alias = "name")]
  pub stack: String,
  /// The service to get the log for.
  pub service: String,
  /// The number of lines of the log tail to include.
  /// Default: 100.
  /// Max: 5000.
  #[serde(default = "default_tail")]
  pub tail: U64,
}

fn default_tail() -> u64 {
  50
}

#[typeshare]
pub type GetStackServiceLogResponse = Log;

//

/// Search the deployment log's tail using `grep`. All lines go to stdout.
/// Response: [Log].
///
/// Note. This call will hit the underlying server directly for most up to date log.
#[typeshare]
#[derive(
  Serialize, Deserialize, Debug, Clone, Request, EmptyTraits,
)]
#[empty_traits(MonitorReadRequest)]
#[response(SearchStackServiceLogResponse)]
pub struct SearchStackServiceLog {
  /// Id or name
  #[serde(alias = "id", alias = "name")]
  pub stack: String,
  /// The service to get the log for.
  pub service: String,
  /// The terms to search for.
  pub terms: Vec<String>,
  /// When searching for multiple terms, can use `AND` or `OR` combinator.
  ///
  /// - `AND`: Only include lines with **all** terms present in that line.
  /// - `OR`: Include lines that have one or more matches in the terms.
  #[serde(default)]
  pub combinator: SearchCombinator,
  /// Invert the results, ie return all lines that DON'T match the terms / combinator.
  #[serde(default)]
  pub invert: bool,
}

#[typeshare]
pub type SearchStackServiceLogResponse = Log;

//

/// Gets a list of existing values used as extra args across other stacks.
/// Useful to offer suggestions. Response: [ListCommonStackExtraArgsResponse]
#[typeshare]
#[derive(
  Serialize, Deserialize, Debug, Clone, Request, EmptyTraits,
)]
#[empty_traits(MonitorReadRequest)]
#[response(ListCommonStackExtraArgsResponse)]
pub struct ListCommonStackExtraArgs {
  /// optional structured query to filter stacks.
  #[serde(default)]
  pub query: StackQuery,
}

#[typeshare]
pub type ListCommonStackExtraArgsResponse = Vec<String>;

//

/// List stacks matching optional query. Response: [ListStacksResponse].
#[typeshare]
#[derive(
  Serialize, Deserialize, Debug, Clone, Default, Request, EmptyTraits,
)]
#[empty_traits(MonitorReadRequest)]
#[response(ListStacksResponse)]
pub struct ListStacks {
  /// optional structured query to filter syncs.
  #[serde(default)]
  pub query: StackQuery,
}

#[typeshare]
pub type ListStacksResponse = Vec<StackListItem>;

//

/// List stacks matching optional query. Response: [ListFullStacksResponse].
#[typeshare]
#[derive(
  Serialize, Deserialize, Debug, Clone, Default, Request, EmptyTraits,
)]
#[empty_traits(MonitorReadRequest)]
#[response(ListFullStacksResponse)]
pub struct ListFullStacks {
  /// optional structured query to filter stacks.
  #[serde(default)]
  pub query: StackQuery,
}

#[typeshare]
pub type ListFullStacksResponse = Vec<Stack>;

//

/// Get current action state for the stack. Response: [StackActionState].
#[typeshare]
#[derive(
  Serialize, Deserialize, Debug, Clone, Request, EmptyTraits,
)]
#[empty_traits(MonitorReadRequest)]
#[response(GetStackActionStateResponse)]
pub struct GetStackActionState {
  /// Id or name
  #[serde(alias = "id", alias = "name")]
  pub stack: String,
}

#[typeshare]
pub type GetStackActionStateResponse = StackActionState;

//

/// Gets a summary of data relating to all syncs.
/// Response: [GetStacksSummaryResponse].
#[typeshare]
#[derive(
  Serialize, Deserialize, Debug, Clone, Request, EmptyTraits,
)]
#[empty_traits(MonitorReadRequest)]
#[response(GetStacksSummaryResponse)]
pub struct GetStacksSummary {}

/// Response for [GetStacksSummary]
#[typeshare]
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct GetStacksSummaryResponse {
  /// The total number of stacks
  pub total: u32,
  /// The number of stacks with Running state.
  pub running: u32,
  /// The number of stacks with Paused state.
  pub paused: u32,
  /// The number of stacks with Stopped state.
  pub stopped: u32,
  /// The number of stacks with Restarting state.
  pub restarting: u32,
  /// The number of stacks with Dead state.
  pub dead: u32,
  /// The number of stacks with Unhealthy state.
  pub unhealthy: u32,
  /// The number of stacks with Down state.
  pub down: u32,
  /// The number of stacks with Unknown state.
  pub unknown: u32,
}

//

/// Get a target stack's configured webhooks. Response: [GetStackWebhooksEnabledResponse].
#[typeshare]
#[derive(
  Serialize, Deserialize, Debug, Clone, Request, EmptyTraits,
)]
#[empty_traits(MonitorReadRequest)]
#[response(GetStackWebhooksEnabledResponse)]
pub struct GetStackWebhooksEnabled {
  /// Id or name
  #[serde(alias = "id", alias = "name")]
  pub stack: String,
}

/// Response for [GetStackWebhooksEnabled]
#[typeshare]
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct GetStackWebhooksEnabledResponse {
  /// Whether the repo webhooks can even be managed.
  /// The repo owner must be in `github_webhook_app.owners` list to be managed.
  pub managed: bool,
  /// Whether pushes to branch trigger refresh. Will always be false if managed is false.
  pub refresh_enabled: bool,
  /// Whether pushes to branch trigger stack execution. Will always be false if managed is false.
  pub deploy_enabled: bool,
}