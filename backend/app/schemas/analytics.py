from typing import List, Dict, Any
from pydantic import BaseModel


class MetricItem(BaseModel):
    title: str
    value: str
    change: float
    description: str


class MonthlyDataPoint(BaseModel):
    month: str
    visitors: int
    pageviews: int
    contacts: int


class DashboardOverviewResponse(BaseModel):
    metrics: Dict[str, MetricItem]
    traffic_trends: List[MonthlyDataPoint]
    projects_count: int
    skills_count: int
    unread_messages: int
    system_status: str

