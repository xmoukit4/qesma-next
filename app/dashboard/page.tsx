import Image from "next/image";
import { MainNav } from "@/components/dashboard/main-nav";
import TeamSwitcher from "@/components/dashboard/team-switcher";
import { UserNav } from "@/components/dashboard/user-nav";
import { Search } from "@/components/dashboard/search";
import { Cards } from "@/app/examples/dashboard/components/cards";

export default function DashboardPage() {
  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/dashboard-light.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="block dark:hidden"
        />
        <Image
          src="/examples/dashboard-dark.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden flex-col md:flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <TeamSwitcher />
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <Search />
              <UserNav />
            </div>
          </div>
        </div>
        <Cards />
      </div>
    </>
  )
}
