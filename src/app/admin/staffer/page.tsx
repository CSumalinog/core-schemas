import StafferTabs from '@/components/adminComponents/StafferTabs';
import { mockStaffers } from '@/mock/staffers';

export default function Staffer() {
  return (
    <>
      <StafferTabs
        staffers={mockStaffers.map((s) => ({
          ...s,
          group: s.group as
            | 'executives'
            | 'scribes'
            | 'creatives'
            | 'managerial',
        }))}
      />
      
    </>
  );
}
