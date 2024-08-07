import { ApiPropertyOptional } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { IsBoolean, IsDateString, IsInt, IsOptional, IsString, IsUUID, Max, MaxLength, Min } from "class-validator";

export function sleep(milliseconds: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(1);
    }, milliseconds);
  });
}


export class PaginationQueryWithoutSort {
  //  TODO should trim() here?
  @MaxLength(3)
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    type: String,
  })
  key?: string;

  @IsOptional()
  @IsInt({
    message: JSON.stringify({
      title: 'offset',
      message: "Parameter 'offset' must be an integer",
    }),
  })
  @Min(0, {
    message: JSON.stringify({
      title: 'offset',
      message: "Parameter 'offset' must be a positive integer",
    }),
  })
  @Type(() => Number)
  @ApiPropertyOptional({
    type: 'integer',
  })
  offset: number = 0;

  @IsOptional()
  @IsInt({
    message: JSON.stringify({
      title: 'limit',
      message: "Parameter 'limit' must be an integer",
    }),
  })
  @Min(0, {
    message: JSON.stringify({
      title: 'limit',
      message: "Parameter 'limit' must be a positive integer",
    }),
  })
  @Max(500)
  @Type(() => Number)
  @ApiPropertyOptional({
    type: 'integer',
  })
  limit: number = 20;
}

export class FindRefereeQuery extends PaginationQueryWithoutSort {
  @ApiPropertyOptional()
  @Expose({ name: 'community_ids' })
  @IsUUID('4', { each: true })
  @IsOptional()
  communityIds?: string[];

  @ApiPropertyOptional()
  @Expose({ name: 'is_kyc_verified' })
  @IsBoolean()
  @IsOptional()
  isKycVerified?: boolean;

  @ApiPropertyOptional()
  @Expose({ name: 'created_from' })
  @IsDateString()
  @IsOptional()
  createdAtFrom?: Date;

  @ApiPropertyOptional()
  @Expose({ name: 'created_to' })
  @IsDateString()
  @IsOptional()
  createdAtTo?: Date;

  @ApiPropertyOptional()
  @Expose({ name: 'kyc_verified_from' })
  @IsDateString()
  @IsOptional()
  kycVerifiedFrom?: Date;

  @ApiPropertyOptional()
  @Expose({ name: 'kyc_verified_to' })
  @IsDateString()
  @IsOptional()
  kycVerifiedTo?: Date;
}




export interface CommunityReferee {
  id: string;
  avatar?: string;
  username?: string;
  fullname?: string;
  state: string;
  isKycVerified: boolean;
  createdAt: Date;
  kycVerifiedAt: Date;
  community: { id: string; name?: string; groupId: string };
}



export class UtcDateUtils {
  public static subDays(date: Date, dayCount: number) {
    const dateClone = new Date(date);
    dateClone.setDate(date.getDate() - dayCount);
    return dateClone;
  }

  public static startOf(date: Date) {
    const clone = new Date(date);
    clone.setUTCHours(0, 0, 0, 0);

    return clone;
  }

  public static endOf(date: Date) {
    const clone = new Date(date);
    clone.setUTCHours(23, 59, 59, 999);

    return clone;
  }

  public static format(
    date: Date,
    format: 'DD/MM/YYY' | 'YYYYMMDDhhmmss' | 'YYYYMMDD'
  ) {
    if (!date) {
      return '';
    }

    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getUTCFullYear();
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');

    switch (format) {
      case 'DD/MM/YYY':
        return `${day}/${month}/${year}`;

      case 'YYYYMMDD':
        return `${year}${month}${day}`;

      case 'YYYYMMDDhhmmss':
        return `${year}${month}${day}${hours}${minutes}${seconds}`;
    }
  }
}

export function redactFullName(fullName: string) {
  const nameParts = fullName.split(' ');
  const lastName = nameParts.pop();
  const repeatCount = lastName.length > 0 ? lastName.length - 1 : 0;
  const redactedLastName = lastName[0] + '*'.repeat(repeatCount);

  return [...nameParts, redactedLastName].join(' ');
}
export function redactUsername(username: string, visibleChars = 2) {
  if (username.length <= visibleChars) {
    return username;
  }
  return (
    username.slice(0, visibleChars) + '*'.repeat(username.length - visibleChars)
  );
}