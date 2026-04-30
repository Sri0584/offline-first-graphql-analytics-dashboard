import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type CardComponentProps = {
	title: string;
	children: React.ReactNode;
	contentClassName?: string;
};

const CardComponent = ({
	title,
	children,
	contentClassName,
}: CardComponentProps) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
			</CardHeader>

			<CardContent className={contentClassName}>{children}</CardContent>
		</Card>
	);
};

export default CardComponent;
