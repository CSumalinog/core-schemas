'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import React from 'react';

export type RoleType =
  | 'editor_in_chief'
  | 'technical_editor'
  | 'creative_director'
  | 'managing_editor'
  | 'associate'
  | 'director'
  | 'head'
  | 'member'
  | 'other';

export type Staffer = {
  id: string;
  name: string;
  role: string;
  group: 'scribes' | 'creatives' | 'managerial' | 'executives';
  roleType: RoleType;
  section?: string; // Section name for heads and their members (e.g., "Section A")
  image?: string;
};

type StafferTabsProps = {
  staffers: Staffer[];
};

const categories = [
  { key: 'executives', label: 'Executives' },
  { key: 'scribes', label: 'Scribes' },
  { key: 'creatives', label: 'Creatives' },
  { key: 'managerial', label: 'Managerial' },
];

// define which section names to render per group
const sectionsPerGroup: Record<string, string[]> = {
  scribes: [
    'Section A',
    'Section B',
    'Section C',
    'Section D',
    'Section E',
    'Section F',
  ],
  creatives: ['Section A', 'Section B', 'Section C', 'Section D'],
};

export default function StafferTabs({ staffers }: StafferTabsProps) {
  return (
    <div className="w-full">
      <Tabs defaultValue="executives" className="space-y-4">
        <TabsList className="flex space-x-4">
          {categories.map((cat) => (
            <TabsTrigger
              key={cat.key}
              value={cat.key}
              className="text-md py-4 font-semibold rounded border-b-2 border-transparent data-[state=active]:border-amber-200 data-[state=active]:text-amber-200 transition-colors"
            >
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((cat) => (
          <TabsContent key={cat.key} value={cat.key} className="mt-6">
            {/* If this group has defined sections, render sectioned table */}
            {sectionsPerGroup[cat.key] ? (
              <table className="min-w-full bg-white shadow-sm rounded-md table-auto">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Photo
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Role
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {sectionsPerGroup[cat.key].map((sectionName) => {
                    const membersInSection = staffers.filter(
                      (s) =>
                        s.group === (cat.key as Staffer['group']) &&
                        (s.section || '') === sectionName
                    );

                    return (
                      <React.Fragment key={sectionName}>
                        {/* Section header row spanning all columns */}
                        <tr>
                          <td
                            colSpan={3}
                            className="px-6 py-2 bg-gray-100 text-sm font-medium text-gray-800"
                          >
                            {sectionName}
                          </td>
                        </tr>

                        {/* If there are members, show them; else show a few empty placeholder rows to match look */}
                        {membersInSection.length > 0
                          ? membersInSection.map((staffer) => (
                              <tr key={staffer.id} className="border-t">
                                <td className="px-6 py-4">
                                  {staffer.image ? (
                                    <div className="w-12 h-12 relative rounded-full overflow-hidden">
                                      <Image
                                        src={staffer.image}
                                        alt={staffer.name}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        sizes="48px"
                                      />
                                    </div>
                                  ) : (
                                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                                      N/A
                                    </div>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                  {staffer.name}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700">
                                  {staffer.role}
                                </td>
                              </tr>
                            ))
                          : // render 3 empty rows for visual spacing (like your screenshot)
                            Array.from({ length: 3 }).map((_, i) => (
                              <tr key={i} className="border-t">
                                <td className="px-6 py-8" />
                                <td className="px-6 py-8" />
                                <td className="px-6 py-8" />
                              </tr>
                            ))}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              /* Fallback: regular flat table for groups without sectioning */
              <table className="min-w-full bg-white shadow-sm rounded-md table-auto">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Photo
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Role
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {staffers
                    .filter((s) => s.group === (cat.key as Staffer['group']))
                    .map((staffer) => (
                      <tr key={staffer.id} className="border-t">
                        <td className="px-6 py-4">
                          {staffer.image ? (
                            <div className="w-12 h-12 relative rounded-full overflow-hidden">
                              <Image
                                src={staffer.image}
                                alt={staffer.name}
                                fill
                                style={{ objectFit: 'cover' }}
                                sizes="48px"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                              N/A
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {staffer.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {staffer.role}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
