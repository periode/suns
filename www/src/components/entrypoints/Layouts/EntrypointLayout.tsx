import { ReactNode } from "react";
import { ENTRYPOINT_STATUS, IEntrypoint, ISession, PARTNER_STATUS } from "../../../utils/types";
import EntrypointCountdown from "../EntrypointCountdown";
import EntrypointPartners from "../EntrypointPartners";

interface EntrypointLayoutProps {
	owned: boolean,
	data: IEntrypoint,
	session: ISession,
	endDate: string
	title: ReactNode,
	module: ReactNode,
	entrypointactions: ReactNode,
}

function EntrypointLayout({
	owned,
	title,
	data,
	module,
	session,
	endDate,
	entrypointactions
}: EntrypointLayoutProps) {

	if (data.status === ENTRYPOINT_STATUS.EntrypointCompleted)
		return (
			<div className="
                        flex flex-col
                        w-full h-full md:w-[720px] md:h-4/5 
                        border border-green-600 
                        text-green-600
                        bg-green-50
                        ">
					<div className="w-full border-b border-green-600">
						{title}
					</div>
					{ module }
					<div className="h-20
                            pl-4 pr-4
                            relative
                            flex items-center justify-between
                            border-t border-green-600">
					{entrypointactions}
				</div>
			</div>
		)
	if (owned)
		return (
			<div className="
                        flex flex-col
                        w-full h-full md:w-[720px] md:h-4/5 
                        border border-amber-500 
                        text-amber-900
                        bg-amber-50
                        ">
					<div className="w-full border-b border-amber-500 text-amber-500">
						{ title }
					</div>
					<div className="w-full md:flex">
						<div className="w-full border-b border-amber-500">
							<EntrypointPartners users={data.users} max_users={data.max_users} partner_status={data.partner_status} sessionUserUuid={session.user.uuid} />
						</div>
					</div>
					{ module }
					<div className="h-20
                            pl-4 pr-4
                            relative
                            flex items-center justify-between
                            border-t border-amber-500">
					{entrypointactions}
				</div>
			</div>
		)
	if (data.status === ENTRYPOINT_STATUS.EntrypointPending)
		return (
			<div className="
                        flex flex-col
                        w-full h-full md:w-[720px] md:h-4/5 
                        border border-stone-500 
                        text-stone-500
                        bg-stone-50
                        ">
				<div className="w-full border-b border-stone-500">
					{title}
				</div>
				<div className="w-full md:flex">
					<div className="w-full border-b border-stone-500">
						<EntrypointCountdown endDate={endDate} />
					</div>
					<div className="w-full md:flex">
						<div className="w-full border-b border-stone-500">
							<EntrypointPartners users={data.users} max_users={data.max_users} partner_status={data.partner_status} sessionUserUuid={session.user.uuid} />
						</div>
					</div>
					{ module }
					<div className="h-20
                            pl-4 pr-4
                            relative
                            flex items-center justify-between
                            border-t border-stone-500">
					{entrypointactions}
				</div>
			</div>
		)
	return (
		<div className="
                        flex flex-col
                        w-full h-full md:w-[720px] md:h-4/5 
                        border border-amber-900 
                        text-amber-900
                        bg-amber-50
                        ">
					<div className="w-full border-b border-amber-900">
						{title}
					</div>
					<div className="w-full md:flex">
					{
						data.partner_status === PARTNER_STATUS.PartnerNone && 
						<div className="w-full border-b border-amber-900">
							<EntrypointCountdown endDate={endDate} />
						</div>
					}
						<div className="md:w-[2px] md:h-full  bg-amber-900"></div>
						<div className="w-full border-b border-amber-900">
							<EntrypointPartners users={data.users} max_users={data.max_users} partner_status={data.partner_status} sessionUserUuid={session.user.uuid} />
						</div>
					</div>
					{ module }
					<div className="h-20
                            pl-4 pr-4
                            relative
                            flex items-center justify-between
                            border-t border-amber-900">
				{entrypointactions}
			</div>
		</div>
	);
}

export default EntrypointLayout;