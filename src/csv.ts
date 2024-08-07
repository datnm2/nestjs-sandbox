import { CommunityReferee, redactFullName, redactUsername, UtcDateUtils } from "src/ulti";
import _, { capitalize } from 'lodash';

export enum USER_STATE {
    ACTIVE = 'ACTIVE',
    DEACTIVATED = 'DEACTIVATED',
    DELETED = 'DELETED',
}
export class CsvReportRow {
    public 'No.': number | string;
    public 'Member Full Name': string;
    public 'Member Username': string;
    public 'Registration Date': string;
    public 'eKYC Status': string;
    public 'eKYC Date': string;
    public 'Community Name': string;
    public 'Status': string;

    constructor(rowNumber: number = 0, data: CommunityReferee = null) {
        Object.assign(
            this,
            {
                'No.': rowNumber,
                'Member Full Name':
                    data.state === USER_STATE.DELETED
                        ? 'Deleted Account'
                        : data.fullname,
                'Member Username': '@' + (data.username ?? ''),
                'Registration Date': UtcDateUtils.format(
                    data.createdAt,
                    'DD/MM/YYY'
                ),
                'eKYC Status':
                    data.state === USER_STATE.DELETED
                        ? 'N/A'
                        : data.isKycVerified
                            ? 'Done'
                            : 'Not Yet',
                'eKYC Date': UtcDateUtils.format(data.kycVerifiedAt, 'DD/MM/YYY'),
                'Community Name': data.community.name ?? '',
                Status: capitalize(data.state),
            }
        );
    }

    public toVi() {
        const isNotEmpty = Object.values(this).some((value) => value !== '');

        return isNotEmpty
            ? {
                STT: this['No.'],
                'Họ và tên':
                    this.Status === _.capitalize(USER_STATE.DELETED)
                        ? 'Tài khoản đã xóa'
                        : redactFullName(this['Member Full Name']),
                'Tên đăng nhập': redactUsername(this['Member Username'], 3),
                'Ngày Đăng Ký': this['Registration Date'],
                'Trạng Thái eKYC':
                    this['eKYC Status'] === 'N/A'
                        ? this['eKYC Status']
                        : this['eKYC Status'] === 'Done'
                            ? 'Đã eKYC'
                            : 'Chưa eKYC',
                'Ngày eKYC': this['eKYC Date'],
            }
            : {
                STT: '',
                'Họ và tên': '',
                'Tên đăng nhập': '',
                'Ngày Đăng Ký': '',
                'Trạng Thái eKYC': '',
                'Ngày eKYC': '',
            };
    }
}
