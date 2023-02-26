const eventTemplateJoin = (currMonth, nextMonth) => {
  return [
    [
      {
        $match: {
          eventTime: {
            $gte: new Date(currMonth),
            $lt: new Date(nextMonth),
          },
        },
      },
      {
        $lookup: {
          from: "wishtemplates",
          localField: "templateId",
          foreignField: "_id",
          as: "template",
          pipeline: [
            {
              $project: {
                wishType: 1,
                title: 1,
                _id: 0,
              },
            },
          ],
        },
      },
      {
        $project: {
          eventTime: 1,
          recipientEmail: 1,
          template: 1,
        },
      },
      {
        $unwind: {
          path: "$template",
        },
      },
    ],
  ];
};

module.exports = eventTemplateJoin;
