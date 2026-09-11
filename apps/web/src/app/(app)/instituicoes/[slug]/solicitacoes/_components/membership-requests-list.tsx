import { getCachedInstitutionMembershipRequests } from '@/server/http/routes/institutions/fetch-institution-membership-requests'
import type { MembershipRequestsFilters } from '../search-params'
import { MembershipRequestsFilters as Filters } from './membership-requests-filters'
import { MembershipRequestsTable } from './membership-requests-table'

type MembershipRequestsListProps = {
  institutionId: string
  institutionSlug: string
  filters: MembershipRequestsFilters
}

export async function MembershipRequestsList({ institutionId, institutionSlug, filters }: MembershipRequestsListProps) {
  const { requests } = await getCachedInstitutionMembershipRequests(institutionId)

  const filtered = requests.filter((request) => request.status === filters.status)

  return (
    <div className="space-y-4">
      <Filters />
      <MembershipRequestsTable data={filtered} institutionId={institutionId} institutionSlug={institutionSlug} />
    </div>
  )
}
