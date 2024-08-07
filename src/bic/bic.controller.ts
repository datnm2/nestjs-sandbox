import { Controller } from '@nestjs/common';
import { Body, Get, Header, Logger, Post, Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';
import { CronExpression } from '@nestjs/schedule';
import { get } from 'http';
import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsInt, IsOptional, IsString, IsUUID, Max, MaxLength, Min } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { Readable } from 'stream';
import * as csv from 'fast-csv';
import { CommunityReferee, FindRefereeQuery } from 'src/ulti';
import { CsvReportRow } from 'src/csv';


@Controller('bic')
export class BicController {
    @Header('Content-Type', 'application/octet-stream')
    @Post('csv')
    public async exportReferees(@Body() query: FindRefereeQuery, @Res() res) {
        const fileName = `Community_referral_tracking_test.csv`;
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);


        query.limit = 100;
        query.offset = 0;
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const outputStream = new Readable({ read() { } });
        const csvStream = csv.format({ headers: true, writeBOM: true });

        outputStream.pipe(csvStream).pipe(res);

        while (true) {
            const data = this.getSampleCommunityReferees();

            this._insertCsvRows({
                referees: data,
                csvStream,
                headerLang: 'en',
                offset: query.offset,
            });

            query.offset += query.limit;

            if (data.length === 1000) {
                break;
            }
        }

        csvStream.end();
    }

    private getSampleCommunityReferees(): CommunityReferee[] {
        // generate a list a sample
        return Array.from({ length: 1000 }, (_, index) => ({
            id: index.toString(),
            avatar: 'https://example.com/avatar.jpg',
            username: `user_${index}`,
            fullname: `User ${index}`,
            state: 'active',
            isKycVerified: index % 2 === 0,
            createdAt: new Date(),
            kycVerifiedAt: new Date(),
            community: {
                id: 'community_id',
                name: 'DĐạt Nguyễn Hoa Diễm Trang Quốc Hưng',
                groupId: 'group_id',
            },
        }));
    }

    private _insertCsvRows(data: {
        referees: CommunityReferee[];
        csvStream: csv.CsvFormatterStream<any, any>;
        headerLang: 'en' | 'vi';
        offset?: number;
    }) {
        const { referees, csvStream, headerLang, offset = 0 } = data;
        if (!referees.length) {
            const emptyRow = new CsvReportRow();
            csvStream.write(headerLang === 'en' ? emptyRow : emptyRow.toVi());
        }

        for (let i = 0; i < referees.length; i++) {
            const referee = referees[i];
            const csvRow = new CsvReportRow(offset + i + 1, referee);
            csvStream.write(headerLang === 'en' ? csvRow : csvRow.toVi());
        }
    }
}
