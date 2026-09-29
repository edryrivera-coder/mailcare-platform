import { NextResponse } from 'next/server';
import type { MessageMetadata, SmartFilterCategory } from '@mailcare/shared-types';

interface GmailHeader {
  name: string;
  value: string;
}

function inferCategory(fromHeader: string, subject: string, labels: string[] = []): SmartFilterCategory {
  if (labels.includes('CATEGORY_PROMOTIONS') || /sale|deal|discount|offer/i.test(subject)) {
    return 'Promotions';
  }
  if (labels.includes('CATEGORY_SOCIAL') || /linkedin|facebook|instagram|twitter|youtube/i.test(fromHeader)) {
    return 'Social';
  }
  if (labels.includes('CATEGORY_FORUMS') || /forum|community|github|reddit/i.test(fromHeader)) {
    return 'Forums';
  }
  if (labels.includes('CATEGORY_UPDATES') || /security|alert|receipt|invoice|statement|verify/i.test(subject)) {
    return 'Updates';
  }
  return 'Newsletters';
}

function inferIconType(fromHeader: string): MessageMetadata['senderIconType'] {
  const lower = fromHeader.toLowerCase();
  if (lower.includes('netflix')) return 'netflix';
  if (lower.includes('amazon')) return 'amazon';
  if (lower.includes('youtube')) return 'youtube';
  if (lower.includes('spotify')) return 'spotify';
  if (lower.includes('facebook') || lower.includes('meta')) return 'facebook';
  return 'google';
}

function formatByteSize(bytes: number): string {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      accessToken?: string;
      email?: string;
    };

    const accessToken = body.accessToken?.trim();
    const targetEmail = body.email?.trim() || 'edryrivera@gmail.com';

    // If user provided a real Google OAuth 2.0 Access Token, query live Gmail API!
    if (accessToken) {
      const listRes = await fetch(
        'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=12',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!listRes.ok) {
        const errJson = await listRes.json().catch(() => ({}));
        return NextResponse.json(
          {
            error: {
              code: 'GMAIL_OAUTH_TOKEN_INVALID',
              message:
                (errJson as { error?: { message?: string } })?.error?.message ||
                'Google API rejected the OAuth 2.0 Access Token. Please generate a fresh token with gmail.readonly scope.',
            },
          },
          { status: 401 }
        );
      }

      const listData = (await listRes.json()) as {
        messages?: { id: string; threadId: string }[];
        resultSizeEstimate?: number;
      };

      const rawItems = listData.messages ?? [];
      const fetchedMessages: MessageMetadata[] = [];

      for (const item of rawItems.slice(0, 10)) {
        const msgRes = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${item.id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date&metadataHeaders=List-Unsubscribe`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!msgRes.ok) continue;
        const msgData = (await msgRes.json()) as {
          id: string;
          threadId: string;
          labelIds?: string[];
          sizeEstimate?: number;
          internalDate?: string;
          payload?: { headers?: GmailHeader[] };
        };

        const headers = msgData.payload?.headers ?? [];
        const getHeader = (name: string) =>
          headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value ?? '';

        const fromRaw = getHeader('From') || 'Unknown Sender';
        const senderName = fromRaw.replace(/<.*?>/g, '').replace(/"/g, '').trim() || fromRaw;
        const emailMatch = fromRaw.match(/<([^>]+)>/);
        const senderEmail = emailMatch ? emailMatch[1]! : fromRaw;
        const subject = getHeader('Subject') || '(No Subject)';
        const unsubHeader = getHeader('List-Unsubscribe');
        const sizeBytes = msgData.sizeEstimate ?? 48 * 1024;

        const dateMs = msgData.internalDate ? Number(msgData.internalDate) : Date.now();
        const diffHours = Math.max(1, Math.round((Date.now() - dateMs) / (1000 * 60 * 60)));
        const relativeDate =
          diffHours < 24 ? `${diffHours}h ago` : `${Math.round(diffHours / 24)}d ago`;

        fetchedMessages.push({
          messageId: `gmail_${msgData.id}`,
          threadId: `thd_${msgData.threadId.slice(0, 8)}`,
          senderName: senderName.slice(0, 32),
          senderEmail,
          senderIconType: inferIconType(fromRaw),
          subject,
          relativeDate,
          sizeBytes,
          formattedSize: formatByteSize(sizeBytes),
          category: inferCategory(fromRaw, subject, msgData.labelIds),
          isUnread: (msgData.labelIds ?? []).includes('UNREAD'),
          unsubscribeMethod: unsubHeader ? 'RFC_8058_POST' : undefined,
          trackersBlocked: unsubHeader ? 2 : 1,
        });
      }

      return NextResponse.json({
        mode: 'LIVE_GMAIL_API',
        mailbox: targetEmail,
        syncedCount: fetchedMessages.length,
        messages: fetchedMessages,
      });
    }

    // Fallback: Simulated live sync for edryrivera@gmail.com when no Google OAuth token is supplied
    const simulatedLiveMessages: MessageMetadata[] = [
      {
        messageId: `msg_edry_google_${Date.now()}`,
        threadId: 'thd_google_sec_01',
        senderName: 'Google Security',
        senderEmail: 'no-reply@accounts.google.com',
        senderIconType: 'google',
        subject: `Security alert for your linked Google Account (${targetEmail})`,
        relativeDate: 'Just now',
        sizeBytes: 94 * 1024,
        formattedSize: '94 KB',
        category: 'Updates',
        isUnread: true,
        trackersBlocked: 0,
      },
      {
        messageId: `msg_edry_github_${Date.now() + 1}`,
        threadId: 'thd_gh_02',
        senderName: 'GitHub Notifications',
        senderEmail: 'notifications@github.com',
        senderIconType: 'google',
        subject: `[mailcare-platform] Production deployment healthy for ${targetEmail}`,
        relativeDate: '14m ago',
        sizeBytes: 128 * 1024,
        formattedSize: '128 KB',
        category: 'Updates',
        isUnread: true,
        unsubscribeMethod: 'RFC_8058_POST',
        trackersBlocked: 1,
      },
      {
        messageId: `msg_edry_netflix_${Date.now() + 2}`,
        threadId: 'thd_nf_03',
        senderName: 'Netflix',
        senderEmail: 'info@mailer.netflix.com',
        senderIconType: 'netflix',
        subject: 'New sci-fi releases added to your list this week',
        relativeDate: '2h ago',
        sizeBytes: 512 * 1024,
        formattedSize: '512 KB',
        category: 'Newsletters',
        isUnread: true,
        unsubscribeMethod: 'RFC_8058_POST',
        trackersBlocked: 4,
      },
      {
        messageId: `msg_edry_spotify_${Date.now() + 3}`,
        threadId: 'thd_sp_04',
        senderName: 'Spotify',
        senderEmail: 'no-reply@spotify.com',
        senderIconType: 'spotify',
        subject: 'Your Discover Weekly playlist is ready',
        relativeDate: '6h ago',
        sizeBytes: 390 * 1024,
        formattedSize: '390 KB',
        category: 'Promotions',
        isUnread: true,
        unsubscribeMethod: 'RFC_8058_POST',
        trackersBlocked: 3,
      },
      {
        messageId: `msg_edry_amazon_${Date.now() + 4}`,
        threadId: 'thd_amz_05',
        senderName: 'Amazon.com',
        senderEmail: 'store-news@amazon.com',
        senderIconType: 'amazon',
        subject: 'Your package delivery update & digital receipt',
        relativeDate: '1d ago',
        sizeBytes: 640 * 1024,
        formattedSize: '640 KB',
        category: 'Updates',
        isUnread: false,
        unsubscribeMethod: 'HTTPS_LINK',
        trackersBlocked: 2,
      },
      {
        messageId: `msg_edry_yt_${Date.now() + 5}`,
        threadId: 'thd_yt_06',
        senderName: 'YouTube',
        senderEmail: 'noreply@youtube.com',
        senderIconType: 'youtube',
        subject: 'New uploads from channels you subscribed to',
        relativeDate: '2d ago',
        sizeBytes: 1126 * 1024,
        formattedSize: '1.1 MB',
        category: 'Social',
        isUnread: false,
        unsubscribeMethod: 'RFC_8058_POST',
        trackersBlocked: 3,
      },
    ];

    return NextResponse.json({
      mode: 'SIMULATED_SYNC',
      mailbox: targetEmail,
      syncedCount: simulatedLiveMessages.length,
      messages: simulatedLiveMessages,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          code: 'GMAIL_SYNC_ERROR',
          message: error instanceof Error ? error.message : 'Unexpected Gmail sync error',
        },
      },
      { status: 500 }
    );
  }
}
